<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\CandidateRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\Timestampable;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    mercure: true,
    denormalizationContext: ['groups' => ['candidate:write']],
    normalizationContext: ['groups' => ['candidate:read', 'position:read']]
)]
#[ORM\Entity(repositoryClass: CandidateRepository::class)]
class Candidate
{
    use Timestampable;

    #[ORM\Id]
    #[ORM\GeneratedValue('SEQUENCE')]
    #[ORM\Column]
    #[Groups(['candidate:read'])]
    private ?int $id = null;

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

    #[ORM\ManyToOne(inversedBy: 'candidates')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['candidate:read', 'candidate:write', 'position:read'])]
    private ?Position $position = null;

    public function __construct()
    {
        $this->votes = new ArrayCollection();
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
}
