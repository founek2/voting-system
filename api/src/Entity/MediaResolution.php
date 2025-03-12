<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[ApiResource(
    normalizationContext: ['groups' => ['media:read']],
    types: ['https://schema.org/MediaObject'],
    outputFormats: ['jsonld' => ['application/ld+json']],
    operations: [
        new Get(uriTemplate: 'public/media-resolutions/{id}'),
        new GetCollection(uriTemplate: 'public/media-resolutions'),
        new Patch(
            uriTemplate: 'media/resolutions/{id}',
            security: 'user.hasRole("ROLE_ADMIN")',
            denormalizationContext: ['groups' => ['media:edit']],
            validationContext: ['groups' => ['media:edit']],
        ),
        new Delete(
            uriTemplate: 'media/resolutions/{id}',
            security: 'user.hasRole("ROLE_ADMIN")',
        ),
        new Post(
            uriTemplate: 'media/resolutions',
            security: 'user.hasRole("ROLE_ADMIN")',
            inputFormats: ['multipart' => ['multipart/form-data']],
            openapi: new Model\Operation(
                requestBody: new Model\RequestBody(
                    content: new \ArrayObject([
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'file' => [
                                        'type' => 'string',
                                        'format' => 'binary'
                                    ]
                                ]
                            ]
                        ]
                    ])
                )
            )
        )
    ],
    order: ['publishedAt' => 'DESC']
)]
#[Vich\Uploadable]
#[ORM\Entity]
class MediaResolution
{
    use TimestampableEntity;

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[Groups(['media:read'])]
    private ?int $id = null;

    #[ApiProperty(types: ['https://schema.org/contentUrl'], writable: false)]
    #[Groups(['media:read', 'media:read_url'])]
    public ?string $contentUrl = null;

    #[Vich\UploadableField(mapping: 'resolution_object', fileNameProperty: 'filePath', size: 'size')]
    #[Assert\NotNull]
    #[Assert\File(extensions: ['jpg', 'jpeg', 'png', 'pdf'])]
    public ?File $file = null;

    #[ApiProperty(writable: false)]
    #[ORM\Column(nullable: true)]
    public ?string $filePath = null;

    #[ORM\Column]
    #[Groups(['media:read', 'media:edit'])]
    public ?string $name = null;

    #[ORM\Column(nullable: true)]
    public ?int $size = null;

    #[ORM\Column]
    #[Groups(['media:read', 'media:edit'])]
    private ?\DateTimeImmutable $publishedAt = null;

    #[ORM\ManyToOne(inversedBy: 'mediaResolutions')]
    #[Groups(['media:read', 'media:edit'])]
    private ?Election $election = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(\DateTimeImmutable $publishedAt): static
    {
        $this->publishedAt = $publishedAt;

        return $this;
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
}
