<?php

declare(strict_types=1);

namespace App\Services;

use App\Dto\RoleDto;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\ZoneRepository;
use Doctrine\ORM\EntityManagerInterface;

class UserService
{
    public function __construct(
        private UserRepository $userRepository,
        private ZoneRepository $zoneRepository,
        private ISProvider $iSProvider,
        private EntityManagerInterface $em,
    ) {}

    public function refreshLocation(User $user)
    {
        $location = $this->iSProvider->getLocation($user);

        $zoneDto = $location->zone;
        $zone = $this->zoneRepository->upsert($zoneDto->id, $zoneDto->name, $zoneDto->alias, $zoneDto->note);

        $user
            ->setDoorNumber($location->doorNumber)
            ->setZone($zone);
    }

    public function refreshRoles(User $user)
    {
        $roles = $this->iSProvider->getUserRoles($user);

        $roles = array_map(fn(RoleDto $role) => $role->role, $roles);
        $user->setRoles($roles);
    }

    public function refresh(User $user)
    {
        $this->refreshLocation($user);
        $this->refreshRoles($user);

        $this->em->flush();
    }
}
