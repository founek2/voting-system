<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Const\VoteValue;
use App\Repository\VoteRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(),
        new GetCollection(
            uriTemplate: 'users/{userId}/votes',
            uriVariables: [
                'userId' => new Link(fromClass: User::class, fromProperty: 'votes')
            ],
            security: 'user.getId() == request.attributes.get("userId") or user.hasRole("ROLE_ADMIN")',
        ),
        new Get(),
        new Post(),
        // new Patch(security: 'user.hasRole("ROLE_ADMIN")'),
    ],
    mercure: true,
    normalizationContext: ['groups' => ['vote:read']],
    denormalizationContext: ['groups' => ['vote:write']],
)]
#[ORM\Entity(repositoryClass: VoteRepository::class)]
#[UniqueEntity(['candidate', 'appUser'])]
#[UniqueConstraint('uniq_vote_idx', ['candidate_id', 'app_user_id'])]
class Vote
{
    #[ORM\Id]
    #[ORM\GeneratedValue('SEQUENCE')]
    #[ORM\Column]
    #[Groups(['vote:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'votes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['vote:read', 'vote:write'])]
    private ?Candidate $candidate = null;

    #[ORM\Column(length: 255, enumType: VoteValue::class)]
    #[Groups(['vote:write'])]
    private ?VoteValue $value = null;

    #[ORM\ManyToOne(inversedBy: 'votes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['vote:read'])]
    private ?User $appUser = null;

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

    public function getValue(): ?VoteValue
    {
        return $this->value;
    }

    public function setValue(VoteValue $value): static
    {
        $this->value = $value;

        return $this;
    }

    public function getAppUser(): ?User
    {
        return $this->appUser;
    }

    public function setAppUser(?User $appUser): static
    {
        $this->appUser = $appUser;

        return $this;
    }
}
