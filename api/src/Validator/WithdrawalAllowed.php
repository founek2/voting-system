<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_CLASS)]
class WithdrawalAllowed extends Constraint
{
    public string $messageWithdrawNotAllowed = 'Withdrawal is not allowed after announcement of results.';
    public string $messageAlreadyWithdrew = 'Candidate already withdrew from the election.';


    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
