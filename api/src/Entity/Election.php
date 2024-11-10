<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Const\ElectionStage;
use App\Repository\ElectionRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\Timestampable;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(),
        new GetCollection(uriTemplate: 'public/elections'),
        new Get(),
        new Post(security: 'user.hasRole("ROLE_ADMIN")'),
        new Patch(security: 'user.hasRole("ROLE_ADMIN")'),
    ],
    mercure: true,
    normalizationContext: ['groups' => ['election:read']],
    denormalizationContext: ['groups' => ['election:write']],
    order: ['id' => 'DESC']
)]
#[ORM\Entity(repositoryClass: ElectionRepository::class)]
class Election
{
    use Timestampable;

    #[ORM\Id]
    #[ORM\GeneratedValue('SEQUENCE')]
    #[ORM\Column]
    #[Groups(['election:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['election:read', 'election:write'])]
    private ?\DateTimeInterface $announcementDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['election:read', 'election:write'])]
    private ?\DateTimeInterface $registrationOfCandidatesDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['election:read', 'election:write'])]
    private ?\DateTimeInterface $campaignDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['election:read', 'election:write'])]
    private ?\DateTimeInterface $electronicVotingDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['election:read', 'election:write'])]
    private ?\DateTimeInterface $ballotVotingDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['election:read', 'election:write'])]
    private ?\DateTimeInterface $preliminaryResultsDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['election:read', 'election:write'])]
    private ?\DateTimeInterface $complaintsDeadlineDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['election:read', 'election:write'])]
    private ?\DateTimeInterface $finalResultsDate = null;

    /**
     * @var Collection<int, Candidate>
     */
    #[ORM\OneToMany(mappedBy: 'election', targetEntity: Candidate::class, orphanRemoval: true)]
    #[Groups(['election:read', 'election:write'])]
    private Collection $candidates;

    /**
     * @var Collection<int, Position>
     */
    #[ORM\ManyToMany(targetEntity: Position::class, inversedBy: 'elections')]
    #[Groups(['election:read', 'election:write'])]
    private Collection $positions;

    public function __construct()
    {
        $this->candidates = new ArrayCollection();
        $this->positions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAnnouncementDate(): ?\DateTimeInterface
    {
        return $this->announcementDate;
    }

    public function setAnnouncementDate(\DateTimeInterface $announcementDate): static
    {
        $this->announcementDate = $announcementDate;

        return $this;
    }

    public function getRegistrationOfCandidatesDate(): ?\DateTimeInterface
    {
        return $this->registrationOfCandidatesDate;
    }

    public function setRegistrationOfCandidatesDate(?\DateTimeInterface $registrationOfCandidatesDate): static
    {
        $this->registrationOfCandidatesDate = $registrationOfCandidatesDate;

        return $this;
    }

    public function getCampaignDate(): ?\DateTimeInterface
    {
        return $this->campaignDate;
    }

    public function setCampaignDate(?\DateTimeInterface $campaignDate): static
    {
        $this->campaignDate = $campaignDate;

        return $this;
    }

    public function getElectronicVotingDate(): ?\DateTimeInterface
    {
        return $this->electronicVotingDate;
    }

    public function setElectronicVotingDate(?\DateTimeInterface $electronicVotingDate): static
    {
        $this->electronicVotingDate = $electronicVotingDate;

        return $this;
    }

    public function getBallotVotingDate(): ?\DateTimeInterface
    {
        return $this->ballotVotingDate;
    }

    public function setBallotVotingDate(?\DateTimeInterface $ballotVotingDate): static
    {
        $this->ballotVotingDate = $ballotVotingDate;

        return $this;
    }

    public function getPreliminaryResultsDate(): ?\DateTimeInterface
    {
        return $this->preliminaryResultsDate;
    }

    public function setPreliminaryResultsDate(?\DateTimeInterface $preliminaryResultsDate): static
    {
        $this->preliminaryResultsDate = $preliminaryResultsDate;

        return $this;
    }

    public function getComplaintsDeadlineDate(): ?\DateTimeInterface
    {
        return $this->complaintsDeadlineDate;
    }

    public function setComplaintsDeadlineDate(?\DateTimeInterface $complaintsDeadlineDate): static
    {
        $this->complaintsDeadlineDate = $complaintsDeadlineDate;

        return $this;
    }

    public function getFinalResultsDate(): ?\DateTimeInterface
    {
        return $this->finalResultsDate;
    }

    public function setFinalResultsDate(?\DateTimeInterface $finalResultsDate): static
    {
        $this->finalResultsDate = $finalResultsDate;

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
            $candidate->setElection($this);
        }

        return $this;
    }

    public function removeCandidate(Candidate $candidate): static
    {
        if ($this->candidates->removeElement($candidate)) {
            // set the owning side to null (unless already changed)
            if ($candidate->getElection() === $this) {
                $candidate->setElection(null);
            }
        }

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
        }

        return $this;
    }

    public function removePosition(Position $position): static
    {
        $this->positions->removeElement($position);

        return $this;
    }

    #[Groups(['election:read'])]
    public function getStage(): ?ElectionStage
    {
        $now = new DateTime();

        if ($this->finalResultsDate <= $now) return ElectionStage::FINAL_RESULTS;
        if ($this->complaintsDeadlineDate <= $now) return ElectionStage::COMPLAINTS;
        if ($this->preliminaryResultsDate <= $now) return ElectionStage::PRELIMINARY_RESULTS;
        if ($this->ballotVotingDate <= $now) return ElectionStage::BALLOG_VOTING;
        if ($this->electronicVotingDate <= $now) return ElectionStage::ELECTRONIC_VOTING;
        if ($this->campaignDate <= $now) return ElectionStage::CAMPAIGN;
        if ($this->registrationOfCandidatesDate <= $now) return ElectionStage::REGISTRATION_OF_CANDIDATES;
        if ($this->announcementDate <= $now) return ElectionStage::ANNOUNCEMENT;

        return null;
    }
}
