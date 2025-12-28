<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\EmailResource;
use App\Entity\Election;
use App\Entity\Zone;
use App\Message\ElectionNotification;
use App\Repository\ElectionRepository;
use App\Services\IsApiService;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\MessageBusInterface;

class NotifyAllProcessor implements ProcessorInterface
{
    public function __construct(
        private MessageBusInterface $bus,
        private ElectionRepository $electionRepository,
        private IsApiService $isApiService,
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
        /** @var Election $election */
        $election = $this->electionRepository->find($electionId);
        if (!$election) {
            throw new NotFoundHttpException('Election not found');
        }

        $positions = $election->getPositions();
        $zoneRestrictions = [];
        $positionWithoutRestrictions = false;
        foreach ($positions as $position) {
            $zoneRestrictions = array_merge($zoneRestrictions, $position->getZoneRestrictions()->toArray());
            if ($position->getZoneRestrictions()->isEmpty()) {
                $positionWithoutRestrictions = true;
            }
        }

        $users = $this->isApiService->fetchUserList();
        foreach ($users as $user) {
            if ($positionWithoutRestrictions || array_find($zoneRestrictions, fn(Zone $zone) => $zone->getName() === $user->zone)) {
                $this->bus->dispatch(new ElectionNotification($election->getId(), $user->email));
            }
        }
    }
}
