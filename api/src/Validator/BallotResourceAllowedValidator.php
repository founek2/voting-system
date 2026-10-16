<?php

namespace App\Validator;

use App\ApiResource\BallotResource;
use App\Const\ElectionStage;
use App\Entity\User;
use App\Entity\Zone;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class BallotResourceAllowedValidator extends ConstraintValidator
{
    public function __construct(private Security $security) {}

    /** 
     * @param BallotResource $ballot 
     * @param BallotResourceAllowed $constraint 
     * */
    public function validate($ballot, Constraint $constraint): void
    {
        if (!$ballot instanceof BallotResource) {
            throw new UnexpectedValueException($ballot, BallotResource::class);
        }

        if (!$constraint instanceof BallotResourceAllowed) {
            throw new UnexpectedValueException($constraint, BallotResourceAllowed::class);
        }

        $votes = $ballot->getVotes();

        if (count($votes) === 0) {
            $this->context
                ->buildViolation($constraint->messageVotesRequired)
                ->addViolation();
            return;
        }

        $election =  $votes[0]->getCandidate()->getElection();
        if (!array_all(
            $votes,
            fn($vote) => $vote->getCandidate()->getElection()->getId() === $election->getId(),
        )) {
            $this->context
                ->buildViolation($constraint->messageDifferentElections)
                ->addViolation();
        }

        if ($election->getStage() !== ElectionStage::ELECTRONIC_VOTING) {
            $this->context
                ->buildViolation($constraint->messageVotingNotAllowed)
                ->addViolation();
        }

        /** @var User $user */
        $user = $this->security->getUser();

        foreach ($ballot->getVotes() as $vote) {
            $zones = $vote->getCandidate()->getPosition()->getZoneRestrictions();
            $zoneWhitelisted = $zones->findFirst(fn($_, Zone $zone) => $user->getZone()->getId() == $zone->getId() && $user->livesAtStrahov());

            if (!$zoneWhitelisted && $zones->count() > 0) {
                $this->context
                    ->buildViolation($constraint->messageZoneNotAllowed)
                    ->addViolation();
            }
        }
    }
}
