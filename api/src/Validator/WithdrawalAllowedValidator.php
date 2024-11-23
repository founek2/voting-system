<?php

namespace App\Validator;

use App\Const\ElectionStage;
use App\Entity\Candidate;
use App\Entity\Position;
use App\Repository\CandidateRepository;
use App\Util\ArrayUtil;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class WithdrawalAllowedValidator extends ConstraintValidator
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

        if (!$candidate->isWithdrawAllowed()) {
            $this->context->buildViolation($constraint->messageWithdrawNotAllowed)
                ->addViolation();
        }

        if ($candidate->getWithdrewAt() != null) {
            $this->context->buildViolation($constraint->messageAlreadyWithdrew)
                ->addViolation();
        }
    }
}
