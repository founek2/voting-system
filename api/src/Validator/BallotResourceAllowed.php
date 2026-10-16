<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_CLASS)]
class BallotResourceAllowed extends Constraint
{
    public string $messageZoneNotAllowed = 'Voting for position in zone, where you are not located is not allowed.';
    public string $messageDifferentElections = 'All votes in a ballot must belong to the same election.';
    public string $messageVotingNotAllowed = 'Voting is only allowed during the electronic voting stage.';
    public string $messageVotesRequired = 'A ballot must contain at least one vote.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
