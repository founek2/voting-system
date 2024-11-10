<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\Repository\PositionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: 'user.hasRole("ROLE_ADMIN")'),
        new Patch(security: 'user.hasRole("ROLE_ADMIN")'),
    ],
    denormalizationContext: ['groups' => ['position:write']],
    normalizationContext: ['groups' => ['position:read']]
)]
#[ORM\Entity(repositoryClass: PositionRepository::class)]
class Position
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['position:read', 'candidate:read'])]
    private ?int $id = null;

    /**
     * @var Collection<int, Zone>
     */
    #[ORM\ManyToMany(targetEntity: Zone::class, inversedBy: 'positions')]
    #[Groups(['position:read', 'position:write'])]
    private Collection $zoneRestrictions;

    /**
     * @var Collection<int, Candidate>
     */
    #[ORM\OneToMany(mappedBy: 'position', targetEntity: Candidate::class)]
    #[Groups(['position:read'])]
    private Collection $candidates;

    #[ORM\Column(length: 255)]
    #[Groups(['position:read', 'position:write', 'candidate:read'])]
    private ?string $name = null;

    /**
     * @var Collection<int, Election>
     */
    #[ORM\ManyToMany(targetEntity: Election::class, mappedBy: 'positions')]
    #[Groups(['position:read'])]
    private Collection $elections;

    public function __construct()
    {
        $this->zoneRestrictions = new ArrayCollection();
        $this->candidates = new ArrayCollection();
        $this->elections = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Zone>
     */
    public function getZoneRestrictions(): Collection
    {
        return $this->zoneRestrictions;
    }

    public function addZoneRestriction(Zone $zoneRestriction): static
    {
        if (!$this->zoneRestrictions->contains($zoneRestriction)) {
            $this->zoneRestrictions->add($zoneRestriction);
        }

        return $this;
    }

    public function removeZoneRestriction(Zone $zoneRestriction): static
    {
        $this->zoneRestrictions->removeElement($zoneRestriction);

        return $this;
    }

    /**
     * @return Collection<int, Candidate>
     */
    public function getCandidates(): Collection
    {
        return $this->candidates;
    }

    public function addCandidate(Candidate $candidate): static
    {
        if (!$this->candidates->contains($candidate)) {
            $this->candidates->add($candidate);
            $candidate->setPosition($this);
        }

        return $this;
    }

    public function removeCandidate(Candidate $candidate): static
    {
        if ($this->candidates->removeElement($candidate)) {
            // set the owning side to null (unless already changed)
            if ($candidate->getPosition() === $this) {
                $candidate->setPosition(null);
            }
        }

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, Election>
     */
    public function getElections(): Collection
    {
        return $this->elections;
    }

    public function addElection(Election $election): static
    {
        if (!$this->elections->contains($election)) {
            $this->elections->add($election);
            $election->addPosition($this);
        }

        return $this;
    }

    public function removeElection(Election $election): static
    {
        if ($this->elections->removeElement($election)) {
            $election->removePosition($this);
        }

        return $this;
    }
}
