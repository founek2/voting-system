<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use App\Const\VoteValue;
use App\Repository\VoteRepository;
use App\State\VoteInvalidateProcessor;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(
            security: 'user.hasRole("ROLE_ADMIN")',
            paginationMaximumItemsPerPage: 2000
        ),
        new GetCollection(
            uriTemplate: 'users/{userId}/votes',
            uriVariables: [
                'userId' => new Link(fromClass: User::class, fromProperty: 'votes')
            ],
            security: 'user.getId() == request.attributes.get("userId") or user.hasRole("ROLE_ADMIN")',
        ),
        new Get(security: 'user.hasRole("ROLE_ADMIN")'),
        new Post(
            uriTemplate: 'votes/{id}/invalidate',
            security: 'object.getInvalidatedAt() == null && user.hasRole("ROLE_ADMIN")',
            denormalizationContext: ['groups' => ['_']],
            processor: VoteInvalidateProcessor::class,
        ),
    ],
    mercure: true,
    normalizationContext: ['groups' => ['vote:read']],
)]
#[ApiFilter(SearchFilter::class, properties: ['candidate.election' => 'exact', 'appUser' => 'exact'])]
#[ORM\Entity(repositoryClass: VoteRepository::class)]
#[UniqueEntity(['candidate', 'appUser'])]
#[UniqueConstraint('uniq_vote_idx', ['candidate_id', 'app_user_id'])]
class Vote
{
    use TimestampableEntity;

    #[ORM\Id]
    #[ORM\GeneratedValue('SEQUENCE')]
    #[ORM\Column]
    #[Groups(['vote:read'])]
    private ?int $id = null;

    #[Assert\NotNull]
    #[ORM\ManyToOne(inversedBy: 'votes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['vote:read', 'vote:write'])]
    private ?Candidate $candidate = null;

    #[Assert\NotNull]
    #[ORM\Column(length: 255, enumType: VoteValue::class)]
    #[Groups(['vote:write'])]
    private ?VoteValue $value = null;

    #[ORM\ManyToOne(inversedBy: 'votes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['vote:read'])]
    private ?User $appUser = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['vote:read'])]
    private ?\DateTimeImmutable $invalidatedAt = null;

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

    public function getInvalidatedAt(): ?\DateTimeImmutable
    {
        return $this->invalidatedAt;
    }

    public function setInvalidatedAt(?\DateTimeImmutable $invalidatedAt): static
    {
        $this->invalidatedAt = $invalidatedAt;

        return $this;
    }
}
