<?php

declare(strict_types=1);

namespace App\Dto;

class LoginResponseDto
{
    public function __construct(
        public string $accessToken,
        public int $expires,
    ) {}
}
