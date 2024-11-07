<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ZoneRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\Timestampable;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    mercure: true,
    normalizationContext: ['groups' => ['zone:read']]
)]
#[ORM\Entity(repositoryClass: ZoneRepository::class)]
class Zone
{
    use Timestampable;

    #[ORM\Id]
    #[ORM\GeneratedValue('NONE')]
    #[ORM\Column]
    #[Groups(['zone:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['zone:read'])]
    private ?string $alias = null;

    #[ORM\Column(length: 255)]
    #[Groups(['zone:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['zone:read'])]
    private ?string $note = null;

    /**
     * @var Collection<int, Position>
     */
    #[ORM\ManyToMany(targetEntity: Position::class, mappedBy: 'zoneRestrictions')]
    private Collection $positions;

    public function __construct()
    {
        $this->positions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getAlias(): ?string
    {
        return $this->alias;
    }

    public function setAlias(string $alias): static
    {
        $this->alias = $alias;

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

    public function getNote(): ?string
    {
        return $this->note;
    }

    public function setNote(string $note): static
    {
        $this->note = $note;

        return $this;
    }

    /**
     * @return Collection<int, Position>
     */
    public function getPositions(): Collection
    {
        return $this->positions;
    }

    public function addPosition(Position $position): static
    {
        if (!$this->positions->contains($position)) {
            $this->positions->add($position);
            $position->addZoneRestriction($this);
        }

        return $this;
    }

    public function removePosition(Position $position): static
    {
        if ($this->positions->removeElement($position)) {
            $position->removeZoneRestriction($this);
        }

        return $this;
    }
}
