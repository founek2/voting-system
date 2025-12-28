<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_CLASS)]
class UserLivesInStrahov extends Constraint
{
    public string $message = 'User must live in Strahov to participate in the election.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
