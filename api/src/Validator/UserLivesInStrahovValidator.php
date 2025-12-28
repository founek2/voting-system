<?php

namespace App\Validator;

use App\Entity\User;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class UserLivesInStrahovValidator extends ConstraintValidator
{
    public function __construct() {}

    /** 
     * @param User $user 
     * @param App\Validator\UserLivesInStrahov $constraint 
     * */
    public function validate($user, Constraint $constraint): void
    {
        if (!$user instanceof User) {
            throw new UnexpectedValueException($user, User::class);
        }

        if (!$constraint instanceof UserLivesInStrahov) {
            throw new UnexpectedValueException($constraint, UserLivesInStrahov::class);
        }

        if (preg_match('#[^0-9]#', $user->getDoorNumber())) {
            $this->context
                ->buildViolation($constraint->message)
                ->addViolation();
        }
    }
}
