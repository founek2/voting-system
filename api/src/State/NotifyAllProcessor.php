<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\EmailResource;
use Symfony\Component\Messenger\MessageBusInterface;

class NotifyAllProcessor implements ProcessorInterface
{
    public function __construct(
        private MessageBusInterface $bus,
    ) {}

    /**
     * @param EmailResource $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if (!$data instanceof EmailResource) {
            throw new \InvalidArgumentException('Data must be an instance of ' . EmailResource::class);
        }

        // TODO
        // $this->bus->dispatch(new ElectionNotification($data->getEmail()));
    }
}
