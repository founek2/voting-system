<?php

namespace App\Tests\Validator;

use App\ApiResource\BallotResource;
use App\Const\ElectionStage;
use App\Entity\Candidate;
use App\Entity\Election;
use App\Entity\Position;
use App\Entity\Vote;
use App\Validator\BallotResourceAllowed;
use App\Validator\BallotResourceAllowedValidator;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Test\ConstraintValidatorTestCase;

class BallotResourceAllowedValidatorTest extends ConstraintValidatorTestCase
{
    protected function createValidator(): BallotResourceAllowedValidator
    {
        return new BallotResourceAllowedValidator($this->createMock(Security::class));
    }

    public function testEmptyBallotAddsViolation(): void
    {
        $constraint = new BallotResourceAllowed();

        $this->validator->validate(new BallotResource(), $constraint);

        $this->buildViolation($constraint->messageVotesRequired)->assertRaised();
    }

    /**
     * @dataProvider electionStages
     */
    public function testElectionStage(?ElectionStage $stage): void
    {
        $election = $this->createMock(Election::class);
        $election->method('getStage')->willReturn($stage);

        $candidate = (new Candidate())
            ->setElection($election)
            ->setPosition(new Position());
        $ballot = (new BallotResource())->addVote((new Vote())->setCandidate($candidate));
        $constraint = new BallotResourceAllowed();

        $this->validator->validate($ballot, $constraint);

        if ($stage === ElectionStage::ELECTRONIC_VOTING) {
            $this->assertNoViolation();
        } else {
            $this->buildViolation($constraint->messageVotingNotAllowed)->assertRaised();
        }
    }

    public static function electionStages(): iterable
    {
        foreach (ElectionStage::cases() as $stage) {
            yield $stage->value => [$stage];
        }

        yield 'no stage' => [null];
    }
}
