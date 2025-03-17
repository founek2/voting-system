<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Const\ElectionStage;
use App\Filter\VoteCandidateFilter;
use App\Repository\CandidateRepository;
use App\State\MarkWinnerCandidateProcessor;
use App\State\NewCandidateProcessor;
use App\State\RejectCandidateProcessor;
use App\State\UnmarkWinnerCandidateProcessor;
use App\State\WithdrawCandidateProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Validator;
use Gedmo\Timestampable\Traits\TimestampableEntity;

#[ApiResource(
    operations: [
        new Get(security: 'user.getId() == object.getAppUser().getId() or user.hasRole("ROLE_ADMIN")'),
        new Post(
            processor: NewCandidateProcessor::class,
            validationContext: ['groups' => ['candidate:write']],
            denormalizationContext: ['groups' => ['candidate:write']],
        ),
        new Patch(
            security: 'user.getId() == object.getAppUser().getId()',
            denormalizationContext: ['groups' => ['candidate:edit']],
        ),
        new GetCollection(
            uriTemplate: 'users/{userId}/candidates',
            security: 'user.getId() == request.attributes.get("userId") or user.hasRole("ROLE_ADMIN")',
            uriVariables: [
                'userId' => new Link(fromClass: User::class, fromProperty: 'candidates')
            ]
        ),
        new GetCollection(
            uriTemplate: 'public/elections/{id}/candidates',
            uriVariables: [
                'id' => new Link(fromClass: Election::class, fromProperty: 'candidates'),
            ],
        ),
        new GetCollection(
            uriTemplate: 'elections/{id}/candidates',
            uriVariables: [
                'id' => new Link(fromClass: Election::class, fromProperty: 'candidates'),
            ],
            filters: [VoteCandidateFilter::class],
        ),
        new GetCollection(security: 'user.hasRole("ROLE_ADMIN")'),
        new Post(
            uriTemplate: 'candidates/{id}/withdraw',
            security: 'object.getAppUser().getId() == user.getId() or user.hasRole("ROLE_ADMIN")',
            processor: WithdrawCandidateProcessor::class,
            validationContext: ['groups' => ['candidate:delete']]
        ),
        new Post(
            uriTemplate: 'candidates/{id}/reject',
            security: 'user.hasRole("ROLE_ADMIN")',
            processor: RejectCandidateProcessor::class,
            validationContext: ['groups' => ['_']]
        ),
        new Post(
            uriTemplate: 'candidates/{id}/mark-winner',
            security: 'user.hasRole("ROLE_ADMIN")',
            processor: MarkWinnerCandidateProcessor::class,
            validationContext: ['groups' => ['_']]
        ),
        new Post(
            uriTemplate: 'candidates/{id}/unmark-winner',
            security: 'user.hasRole("ROLE_ADMIN")',
            processor: UnmarkWinnerCandidateProcessor::class,
            validationContext: ['groups' => ['_']]
        ),
    ],
    mercure: true,
    normalizationContext: ['groups' => ['candidate:read']]
)]
#[ORM\Entity(repositoryClass: CandidateRepository::class)]
#[ApiFilter(SearchFilter::class, properties: ['election' => 'exact', 'appUser' => 'exact', 'position' => 'exact'])]
#[Validator\WithdrawalAllowed(groups: ['candidate:delete'])]
#[Validator\CandidateAllowed(groups: ['candidate:write'])]
#[ORM\UniqueConstraint('single_candidate_idx', ['election_id', 'app_user_id', 'withdrew_at'])]
class Candidate
{
    use TimestampableEntity;

    #[ORM\Id]
    #[ORM\GeneratedValue('SEQUENCE')]
    #[ORM\Column]
    #[Groups(['candidate:read'])]
    private ?int $id = null;


    #[Assert\NotNull(groups: ['Default', 'candidate:write'])]
    #[ORM\ManyToOne(inversedBy: 'candidates')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['candidate:read', 'candidate:write'])]
    private ?Election $election = null;

    #[ORM\ManyToOne(inversedBy: 'candidates')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['candidate:read'])]
    private ?User $appUser = null;

    /**
     * @var Collection<int, Vote>
     */
    #[ORM\OneToMany(mappedBy: 'candidate', targetEntity: Vote::class)]
    private Collection $votes;

    #[Assert\NotNull(groups: ['Default', 'candidate:write'])]
    #[ORM\ManyToOne(inversedBy: 'candidates')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['candidate:read', 'candidate:write'])]
    private ?Position $position = null;

    #[ORM\OneToOne(inversedBy: 'candidate', cascade: ['persist', 'remove'])]
    #[Groups(['candidate:read', 'candidate:write', 'candidate:edit'])]
    private ?MediaPoster $poster = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['candidate:read'])]
    private ?\DateTimeImmutable $withdrewAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['candidate:read'])]
    private ?\DateTimeImmutable $rejectedAt = null;

    /**
     * @var Collection<int, BallotResult>
     */
    #[ORM\OneToMany(mappedBy: 'candidate', targetEntity: BallotResult::class)]
    private Collection $ballotResults;

    #[ORM\Column(nullable: true)]
    #[Groups(['candidate:read'])]
    private ?\DateTimeImmutable $winnerMarkedAt = null;

    public function __construct()
    {
        $this->votes = new ArrayCollection();
        $this->ballotResults = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getElection(): ?Election
    {
        return $this->election;
    }

    public function setElection(?Election $election): static
    {
        $this->election = $election;

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

    /**
     * @return Collection<int, Vote>
     */
    public function getVotes(): Collection
    {
        return $this->votes;
    }

    public function addVote(Vote $vote): static
    {
        if (!$this->votes->contains($vote)) {
            $this->votes->add($vote);
            $vote->setCandidate($this);
        }

        return $this;
    }

    public function removeVote(Vote $vote): static
    {
        if ($this->votes->removeElement($vote)) {
            // set the owning side to null (unless already changed)
            if ($vote->getCandidate() === $this) {
                $vote->setCandidate(null);
            }
        }

        return $this;
    }

    public function getPosition(): ?Position
    {
        return $this->position;
    }

    public function setPosition(?Position $position): static
    {
        $this->position = $position;

        return $this;
    }

    public function getPoster(): ?MediaPoster
    {
        return $this->poster;
    }

    public function setPoster(?MediaPoster $poster): static
    {
        $this->poster = $poster;

        return $this;
    }

    public function getWithdrewAt(): ?\DateTimeImmutable
    {
        return $this->withdrewAt;
    }

    public function setWithdrewAt(?\DateTimeImmutable $withdrewAt): static
    {
        $this->withdrewAt = $withdrewAt;

        return $this;
    }

    #[Groups(['candidate:read'])]
    public function isWithdrawAllowed(): bool
    {
        return $this->getElection()->getStage() != ElectionStage::FINAL_RESULTS && $this->withdrewAt == null;
    }

    /**
     * @return Collection<int, BallotResult>
     */
    public function getBallotResults(): Collection
    {
        return $this->ballotResults;
    }

    public function addBallotResult(BallotResult $ballotResult): static
    {
        if (!$this->ballotResults->contains($ballotResult)) {
            $this->ballotResults->add($ballotResult);
            $ballotResult->setCandidate($this);
        }

        return $this;
    }

    public function removeBallotResult(BallotResult $ballotResult): static
    {
        if ($this->ballotResults->removeElement($ballotResult)) {
            // set the owning side to null (unless already changed)
            if ($ballotResult->getCandidate() === $this) {
                $ballotResult->setCandidate(null);
            }
        }

        return $this;
    }

    public function getWinnerMarkedAt(): ?\DateTimeImmutable
    {
        return $this->winnerMarkedAt;
    }

    public function setWinnerMarkedAt(?\DateTimeImmutable $winnerMarkedAt): static
    {
        $this->winnerMarkedAt = $winnerMarkedAt;

        return $this;
    }

    public function getRejectedAt(): ?\DateTimeImmutable
    {
        return $this->rejectedAt;
    }

    public function setRejectedAt(?\DateTimeImmutable $rejectedAt): static
    {
        $this->rejectedAt = $rejectedAt;

        return $this;
    }
}
