<?php

namespace App\Validator;

use App\Entity\Candidate;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class WithdrawalAllowedValidator extends ConstraintValidator
{
    public function __construct() {}

    /** 
     * @param Candidate $candidate 
     * @param App\Validator\CandidateAllowed $constraint 
     * */
    public function validate($candidate, Constraint $constraint): void
    {
        if (!$candidate instanceof Candidate) {
            throw new UnexpectedValueException($candidate, Candidate::class);
        }

        if (!$constraint instanceof WithdrawalAllowed) {
            throw new UnexpectedValueException($constraint, WithdrawalAllowed::class);
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
