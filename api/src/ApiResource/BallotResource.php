<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Entity\Vote;
use App\State\NewBallotVoteProcessor;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Post(
            processor: NewBallotVoteProcessor::class,
            denormalizationContext: ['groups' => ['vote:write']],
        ),
    ],
    uriTemplate: 'ballot/vote'
)]
class BallotResource
{
    #[Assert\Valid]
    #[Groups(['vote:write'])]
    private array $votes = [];

    /**
     * @return Vote[]
     */
    public function getVotes(): array
    {
        return $this->votes;
    }

    public function addVote(Vote $vote): static
    {
        $this->votes[] = $vote;

        return $this;
    }

    public function setVotes(array $votes): static
    {
        $this->votes = $votes;

        return $this;
    }
}
