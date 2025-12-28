<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use App\Dto\LoginResponseDto;
use App\State\LoginProcessor;
use App\State\LoginProvider;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Post(
            processor: LoginProcessor::class,
            denormalizationContext: ['groups' => 'code:write'],
            output: LoginResponseDto::class,
        ),
        new Get(
            provider: LoginProvider::class,
            normalizationContext: ['groups' => 'url:read']
        ),
    ],
    uriTemplate: 'public/login'
)]
class LoginResource
{
    #[Assert\NotBlank]
    #[Groups(['code:write'])]
    private ?string $code = null;


    #[Groups(['url:read'])]
    private ?string $authorizationUrl = null;

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getAuthorizationUrl(): ?string
    {
        return $this->authorizationUrl;
    }

    public function setAuthorizationUrl(string $url): static
    {
        $this->authorizationUrl = $url;

        return $this;
    }
}
