<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\BallotResultRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(
            security: 'user.hasRole("ROLE_ADMIN")',
        ),
        new Get(
            security: 'user.hasRole("ROLE_ADMIN")',
        ),
        new Post(
            security: 'user.hasRole("ROLE_ADMIN")',
        ),
        new Patch(
            security: 'user.hasRole("ROLE_ADMIN")',
        ),
        new Delete(
            security: 'user.hasRole("ROLE_ADMIN")',
        ),
    ],
    normalizationContext: ['groups' => ['result:read', 'candidate:read']],
    denormalizationContext: ['groups' => ['result:write']],
)]
#[ApiFilter(SearchFilter::class, properties: ['candidate.election' => 'exact', 'candidate.election.id' => 'exact'])]
#[ORM\Entity(repositoryClass: BallotResultRepository::class)]
#[UniqueEntity(['candidate'])]
class BallotResult
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['result:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'ballotResults')]
    #[ORM\JoinColumn(nullable: false, unique: true)]
    #[Groups(['result:read', 'result:write'])]
    private ?Candidate $candidate = null;

    #[ORM\Column]
    #[Groups(['result:read', 'result:write'])]
    private ?int $positiveVotes = null;

    #[ORM\Column]
    #[Groups(['result:read', 'result:write'])]
    private ?int $negativeVotes = null;

    #[ORM\Column]
    #[Groups(['result:read', 'result:write'])]
    private ?int $neutralVotes = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCandidate(): ?Candidate
    {
        return $this->candidate;
    }

    public function setCandidate(?Candidate $candidate): static
    {
        $this->candidate = $candidate;

        return $this;
    }

    public function getPositiveVotes(): ?int
    {
        return $this->positiveVotes;
    }

    public function setPositiveVotes(int $positiveVotes): static
    {
        $this->positiveVotes = $positiveVotes;

        return $this;
    }

    public function getNegativeVotes(): ?int
    {
        return $this->negativeVotes;
    }

    public function setNegativeVotes(int $negativeVotes): static
    {
        $this->negativeVotes = $negativeVotes;

        return $this;
    }

    public function getNeutralVotes(): ?int
    {
        return $this->neutralVotes;
    }

    public function setNeutralVotes(int $neutralVotes): static
    {
        $this->neutralVotes = $neutralVotes;

        return $this;
    }
}
