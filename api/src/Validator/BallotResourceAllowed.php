<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_CLASS)]
class BallotResourceAllowed extends Constraint
{
    public string $messageZoneNotAllowed = 'Voting for position in zone, where you are not located.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
