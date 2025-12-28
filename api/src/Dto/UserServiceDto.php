<?php

declare(strict_types=1);

namespace App\Dto;

use DateTimeImmutable;

class UserServiceDto
{
    public function __construct(
        /** pokud je null, tak počátek platnosti není omezen */
        public ?DateTimeImmutable $from,
        /** pokud je null, tak konec platnosti není omezen */
        public ?DateTimeImmutable $to,
        /** payed | reward | free | system */
        public string $usetype,
        public ?string $note,
        public ServiceDto $service,
    ) {}
}
