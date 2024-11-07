<?php

declare(strict_types=1);

namespace App\Dto;

class ZoneDto
{
    public function __construct(
        public int $id,
        public string $name,
        public string $alias,
        public ?string $note,
    ) {}
}
