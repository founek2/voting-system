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
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[Vich\Uploadable]
#[ORM\Entity]
#[ApiResource(
    normalizationContext: ['groups' => ['media:read']],
    types: ['https://schema.org/MediaObject'],
    outputFormats: ['jsonld' => ['application/ld+json']],
    operations: [
        new Get(uriTemplate: 'public/media-reports/{id}'),
        new GetCollection(uriTemplate: 'public/media-reports'),
        new Patch(
            uriTemplate: 'media/reports/{id}',
            security: 'user.hasRole("ROLE_ADMIN")',
            denormalizationContext: ['groups' => ['media:edit']],
            validationContext: ['groups' => ['media:edit']],
        ),
        new Delete(
            uriTemplate: 'media/reports/{id}',
            security: 'user.hasRole("ROLE_ADMIN")',
        ),
        new Post(
            uriTemplate: 'media/reports',
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
    order: ['id' => 'DESC']
)]
class MediaReport
{
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    #[Groups(['media:read'])]
    private ?int $id = null;

    #[ApiProperty(types: ['https://schema.org/contentUrl'], writable: false)]
    #[Groups(['media:read'])]
    public ?string $contentUrl = null;

    #[Vich\UploadableField(mapping: 'report_object', fileNameProperty: 'filePath')]
    #[Assert\NotNull]
    public ?File $file = null;

    #[ApiProperty(writable: false)]
    #[ORM\Column(nullable: true)]
    public ?string $filePath = null;

    #[ORM\Column]
    #[Groups(['Default', 'media:read', 'media:edit'])]
    public ?string $name = null;

    public function getId(): ?int
    {
        return $this->id;
    }
}