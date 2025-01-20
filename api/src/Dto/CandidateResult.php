<?php

declare(strict_types=1);

namespace App\Dto;

use App\Entity\Candidate;
use Symfony\Component\Serializer\Annotation\Groups;

class CandidateResult
{
    public function __construct(
        #[Groups(['candidate:read'])]
        public Candidate $candidate,
        #[Groups(['candidate:read'])]
        public int $positiveVotes = 0,
        #[Groups(['candidate:read'])]
        public int $negativeVotes = 0,
        #[Groups(['candidate:read'])]
        public int $neutralVotes = 0,
    ) {}
}
