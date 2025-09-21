<?php

declare(strict_types=1);

namespace App\Dto;

class UserEmailDto
{
    public function __construct(
        public int $uid,
        public string $email,
        public string $zone,
    ) {}
}
