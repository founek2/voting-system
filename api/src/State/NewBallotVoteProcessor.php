<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\BallotResource;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class NewBallotVoteProcessor implements ProcessorInterface
{
    public function __construct(private Security $security, private EntityManagerInterface $em) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if (!$data instanceof BallotResource) {
            throw new \InvalidArgumentException('Data must be an instance of ' . BallotResource::class);
        }

        $user = $this->security->getUser();
        foreach ($data->getVotes() as $vote) {
            $vote->setAppUser($user);
            $this->em->persist($vote);
        }

        $this->em->flush();
    }
}
