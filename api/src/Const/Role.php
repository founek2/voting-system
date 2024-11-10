<?php

declare(strict_types=1);

namespace App\Const;

class Role
{
    const VOTER = 'voter';
    const CHAIRMAN = 'ROLE_ADMIN';
    const MEMBER = 'member';

    const ALL_VALUES = [self::VOTER, self::CHAIRMAN, self::MEMBER];
}
