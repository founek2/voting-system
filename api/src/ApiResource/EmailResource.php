<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Controller\EmailPreviewController;
use App\State\NotifySingleProcessor;
use App\State\NotifyAllProcessor;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: 'emails/elections/{electionId}/notify-single',
            security: 'user.hasRole("ROLE_ADMIN")',
            processor: NotifySingleProcessor::class,
            read: false,
            denormalizationContext: ['groups' => ['write']],
        ),
        new Post(
            uriTemplate: 'emails/elections/{electionId}/notify-all',
            security: 'user.hasRole("ROLE_ADMIN")',
            provider: NotifyAllProcessor::class,
            read: false,
            denormalizationContext: ['groups' => ['_']],
        ),
        new GetCollection(
            uriTemplate: 'public/emails/preview',
            security: "request.server.get('APP_ENV') === 'local' or request.server.get('APP_ENV') === 'dev'",
            controller: EmailPreviewController::class,
            formats: ['html' => 'text/html; charset=utf-8'],
            denormalizationContext: ['groups' => ['_']],
        ),
    ],
    uriTemplate: 'emails'
)]
class EmailResource
{
    #[Assert\Email()]
    #[Groups(['write'])]
    private ?string $email = null;

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }
}
