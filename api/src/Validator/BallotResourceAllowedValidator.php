<?php

namespace App\Validator;

use App\ApiResource\BallotResource;
use App\Const\ElectionStage;
use App\Entity\Candidate;
use App\Entity\Position;
use App\Entity\User;
use App\Entity\Zone;
use App\Repository\CandidateRepository;
use App\Util\ArrayUtil;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class BallotResourceAllowedValidator extends ConstraintValidator
{
    public function __construct(private CandidateRepository $candidateRepository, private Security $security) {}

    /** 
     * @param BallotResource $ballot 
     * @param App\Validator\BallotResourceAllowed $constraint 
     * */
    public function validate($ballot, Constraint $constraint): void
    {
        if (!$ballot instanceof BallotResource) {
            throw new UnexpectedValueException($ballot, BallotResource::class);
        }

        if (!$constraint instanceof BallotResourceAllowed) {
            throw new UnexpectedValueException($constraint, BallotResourceAllowed::class);
        }

        /** @var User $user */
        $user = $this->security->getUser();

        foreach ($ballot->getVotes() as $vote) {
            $zones = $vote->getCandidate()->getPosition()->getZoneRestrictions();
            $zoneWhitelisted = $zones->findFirst(fn($_, Zone $zone) => $user->getZone()->getId() == $zone->getId());

            if (!$zoneWhitelisted && $zones->count() > 0) {
                $this->context
                    ->buildViolation($constraint->messageZoneNotAllowed)
                    ->addViolation();
            }
        }
    }
}
