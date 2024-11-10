<?php

namespace App\Validator;

use App\Const\ElectionStage;
use App\Entity\Candidate;
use App\Entity\Country;
use App\Entity\Invoice\Invoice;
use App\Entity\Position;
use App\Repository\CandidateRepository;
use App\Util\ArrayUtil;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class CandidateAllowedValidator extends ConstraintValidator
{
    public function __construct(private CandidateRepository $candidateRepository, private Security $security) {}

    /** 
     * @param Candidate $candidate 
     * @param App\Validator\CandidateAllowed $constraint 
     * */
    public function validate($candidate, Constraint $constraint): void
    {
        if (!$candidate instanceof Candidate) {
            throw new UnexpectedValueException($candidate, Candidate::class);
        }

        if (!$constraint instanceof CandidateAllowed) {
            throw new UnexpectedValueException($constraint, CandidateAllowed::class);
        }

        if ($candidate->getElection()->getStage() != ElectionStage::REGISTRATION_OF_CANDIDATES) {
            $this->context->buildViolation($constraint->messageRegistrationNotAllowed)
                ->addViolation();
        }

        $possitions = $candidate->getElection()->getPositions()->toArray();
        $allowed = ArrayUtil::findInArray($possitions, fn(Position $position) => $position->getId() == $candidate->getPosition()->getId());
        if (!$allowed) {
            $this->context->buildViolation($constraint->messagePositionNotAllowed)
                ->addViolation();
        }

        $user = $this->security->getUser();
        $existingCandidate = $this->candidateRepository->findOneByElectionAndUser($candidate->getElection(), $user);
        if ($existingCandidate) {
            $this->context->buildViolation($constraint->messageAlreadyAplied)
                ->addViolation();
        }
    }
}
