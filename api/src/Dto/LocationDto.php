<?php

declare(strict_types=1);

namespace App\Dto;

class LocationDto
{
    public function __construct(
        public int $id,
        public string $doorNumber,
        public int $floor,
        public ?string $name,
        public ZoneDto $zone,
    ) {}
}
