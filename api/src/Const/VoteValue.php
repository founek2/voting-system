<?php

declare(strict_types=1);

namespace App\Const;

enum VoteValue: int
{
    case Positive = 1;
    case Neutral = 0;
    case Negative = -1;
}
