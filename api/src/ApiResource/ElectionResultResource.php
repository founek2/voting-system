<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use App\Dto\CandidateResult;
use App\Entity\Election;
use App\Entity\Vote;
use App\State\ElectionResultProvider;
use App\State\NewBallotVoteProcessor;
use App\Validator\BallotResourceAllowed;
use DateTime;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: 'elections/{id}/result',
            security: 'user.hasRole("ROLE_ADMIN")',
            provider: ElectionResultProvider::class,
            normalizationContext: ['groups' => ['candidate:read']],
        ),
    ],
)]
#[BallotResourceAllowed()]
class ElectionResultResource
{
    public function __construct(
        public int $id,
        #[Groups(['candidate:read'])]
        // /** @var CandidateResult[] $candidates */
        public array $candidates = [],
    ) {}

    // /** @return CandidateResult[] */
    // public function getCandidates(): array
    // {
    //     return $this->candidates;
    // }

    // public function addCandidate(CandidateResult $candidate): static
    // {
    //     $this->candidates[] = $candidate;

    //     return $this;
    // }

    // /** @param CandidateResult[] */
    // public function setCandidates($candidates): static
    // {
    //     $this->candidates = $candidates;

    //     return $this;
    // }
}
