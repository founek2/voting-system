<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\State\NotifySingleProcessor;
use App\State\NotifyAllProcessor;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: 'emails/notify-single',
            processor: NotifySingleProcessor::class,
            denormalizationContext: ['groups' => ['write']],
        ),
        new Post(
            uriTemplate: 'emails/notify-all',
            provider: NotifyAllProcessor::class,
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
