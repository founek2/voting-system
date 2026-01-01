<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Serializer\Annotation\SerializedName;

class ServiceDto
{
    public function __construct(
        public string $alias,
        public string $name,
        public string $note,
        /** free | managed | payed | free_auto */
        #[SerializedName('servicetype')]
        public string $serviceType,
        public ?string $webUrl,
    ) {}
}
