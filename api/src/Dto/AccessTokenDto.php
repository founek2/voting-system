<?php

declare(strict_types=1);

namespace App\Dto;

use InvalidArgumentException;

class AccessTokenDto
{
    private int $expires;

    public function __construct(array $options)
    {
        if (!isset($options['expires'])) {
            throw new InvalidArgumentException('Missing required key "expires"');
        }

        $this->expires = $options['expires'];
    }

    public function jsonSerialize(): array
    {
        return ['expires' => $this->expires];
    }

    public function getExpires(): int
    {
        return $this->expires;
    }

    public function hasExpired()
    {
        return $this->getExpires() < time();
    }
}
