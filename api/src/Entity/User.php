<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use App\Const\Role;
use App\Doctrine\Types\AccessTokenType;
use App\Dto\AccessTokenDto;
use App\Repository\UserRepository;
use App\State\UserProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\Timestampable;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use League\OAuth2\Client\Provider\ResourceOwnerInterface;
use League\OAuth2\Client\Token\AccessToken;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    mercure: true,
    normalizationContext: ['groups' => ['user:read']],
    operations: [
        new GetCollection(
            security: 'user.hasRole("ROLE_ADMIN")',
            paginationMaximumItemsPerPage: 2000,
        ),
        new Get(
            provider: UserProvider::class,
        ),
    ]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'votes.candidate.election' => 'exact',
    'votes.candidate.position' => 'exact',
    'zone' => 'exact'
])]
#[ApiFilter(ExistsFilter::class, properties: ['votes.invalidatedAt'])]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity('email')]
#[UniqueEntity('username')]
class User implements ResourceOwnerInterface, UserInterface
{
    use TimestampableEntity;

    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'NONE')]
    #[ORM\Column]
    #[Groups(['user:read', 'candidate:read', 'vote:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['user:read'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'candidate:read', 'vote:read', 'member:public:read'])]
    private ?string $firstName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'candidate:read', 'vote:read', 'member:public:read'])]
    private ?string $lastName = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['user:read'])]
    private ?string $username = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'candidate:read'])]
    private ?string $photoSmallUrl = null;

    #[ORM\Column(length: 255, type: AccessTokenType::MYTYPE)]
    private ?AccessTokenDto $accessToken = null;

    #[ORM\ManyToOne]
    #[Groups(['user:read', 'vote:read'])]
    private ?Zone $zone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read'])]
    private ?string $doorNumber = null;

    #[ORM\Column(type: Types::JSON)]
    #[Groups(['user:read'])]
    #[ApiProperty(example: [Role::MEMBER], openapiContext: ["enum" => Role::ALL_VALUES])]
    private array $roles = [];

    /**
     * @var Collection<int, Candidate>
     */
    #[ORM\OneToMany(mappedBy: 'appUser', targetEntity: Candidate::class)]
    private Collection $candidates;

    /**
     * @var Collection<int, Vote>
     */
    #[ORM\OneToMany(mappedBy: 'appUser', targetEntity: Vote::class)]
    private Collection $votes;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $additionalRoles = [];

    public function __construct()
    {
        $this->candidates = new ArrayCollection();
        $this->votes = new ArrayCollection();
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getPhotoSmallUrl(): ?string
    {
        return $this->photoSmallUrl;
    }

    public function setPhotoSmallUrl(?string $photoSmallUrl): static
    {
        $this->photoSmallUrl = $photoSmallUrl;

        return $this;
    }

    public function toArray(): array
    {
        return ['id' => $this->id, 'username' => $this->username, 'email' => $this->email, 'roles' => $this->roles];
    }

    public function getAccessToken(): ?AccessTokenDto
    {
        return $this->accessToken;
    }

    public function setAccessToken(AccessTokenDto $accessToken): static
    {
        $this->accessToken = $accessToken;

        return $this;
    }

    public function getZone(): ?Zone
    {
        return $this->zone;
    }

    public function setZone(?Zone $zone): static
    {
        $this->zone = $zone;

        return $this;
    }

    public function getDoorNumber(): ?string
    {
        return $this->doorNumber;
    }

    public function setDoorNumber(?string $doorNumber): static
    {
        $this->doorNumber = $doorNumber;

        return $this;
    }

    public function getRoles(): array
    {
        $roles = array_merge($this->roles, $this->additionalRoles);
        // guarantee every user at least has VOTER
        $roles[] = Role::VOTER;

        return array_unique($roles);
    }

    public function hasRole(string $role): bool
    {
        return in_array($role, $this->getRoles());
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

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
            $candidate->setAppUser($this);
        }

        return $this;
    }

    public function removeCandidate(Candidate $candidate): static
    {
        if ($this->candidates->removeElement($candidate)) {
            // set the owning side to null (unless already changed)
            if ($candidate->getAppUser() === $this) {
                $candidate->setAppUser(null);
            }
        }

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
            $vote->setAppUser($this);
        }

        return $this;
    }

    public function removeVote(Vote $vote): static
    {
        if ($this->votes->removeElement($vote)) {
            // set the owning side to null (unless already changed)
            if ($vote->getAppUser() === $this) {
                $vote->setAppUser(null);
            }
        }

        return $this;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getAdditionalRoles(): ?array
    {
        return $this->additionalRoles;
    }

    public function setAdditionalRoles(?array $additionalRoles): static
    {
        $this->additionalRoles = $additionalRoles;

        return $this;
    }

    public function livesAtStrahov(): bool
    {
        return preg_match('/[0-9]/', $this->getDoorNumber()) == 1;
    }
}
