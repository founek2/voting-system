<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use App\Repository\BoardMemberRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: 'public/board_members',
            normalizationContext: ['groups' => ['member:public:read']],
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
    normalizationContext: ['groups' => ['member:read']],
    denormalizationContext: ['groups' => ['member:write']],
)]
#[ORM\Entity(repositoryClass: BoardMemberRepository::class)]
class BoardMember
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['member:read'])]
    private ?int $id = null;

    #[ORM\OneToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['member:read', 'member:write', 'member:public:read'])]
    private ?User $appUser = null;

    #[ORM\ManyToOne(inversedBy: 'boardMembers')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['member:read', 'member:write', 'member:public:read'])]
    private ?Position $position = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAppUser(): ?User
    {
        return $this->appUser;
    }

    public function setAppUser(User $appUser): static
    {
        $this->appUser = $appUser;

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
