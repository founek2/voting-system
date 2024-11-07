<?php

declare(strict_types=1);

namespace App\Dto;

class ServiceDto
{
    public function __construct(
        public string $alias,
        public string $name,
        public string $note,
        /** free | managed | payed | free_auto */
        public string $serviceType,
        public ?string $webUrl,
    ) {}
}
