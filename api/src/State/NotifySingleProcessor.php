<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\EmailResource;
use App\Mailing\SendElectionNotificationeEmail;
use App\Message\ElectionNotification;
use App\Repository\ElectionRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\MessageBusInterface;

class NotifySingleProcessor implements ProcessorInterface
{
    public function __construct(
        private MessageBusInterface $bus,
        private ElectionRepository $electionRepository,
    ) {}

    /**
     * @param EmailResource $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if (!$data instanceof EmailResource) {
            throw new \InvalidArgumentException('Data must be an instance of ' . EmailResource::class);
        }
        $electionId = $uriVariables['electionId'];
        $election = $this->electionRepository->find($electionId);
        if (!$election) {
            throw new NotFoundHttpException('Election not found');
        }

        $this->bus->dispatch(new ElectionNotification($election->getId(), $data->getEmail()));
    }
}
