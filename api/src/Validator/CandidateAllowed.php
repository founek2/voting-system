<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_CLASS)]
class CandidateAllowed extends Constraint
{
    public string $messageRegistrationNotAllowed = 'The election is not in stage to register candidates.';
    public string $messagePositionNotAllowed = 'The selected position is not available for this election.';
    public string $messageAlreadyAplied = 'Only one candidate per election is permitted.';


    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
