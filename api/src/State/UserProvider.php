<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\UserRepository;
use App\Security\Voter\UserVoter;
use Exception;
use RuntimeException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class UserProvider implements ProviderInterface
{
    public function __construct(
        private Security $security,
        private UserRepository $userRepository,
        private AuthorizationCheckerInterface $authorizationCheckerInterface
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $id = $uriVariables['id'];
        if ($id === 0) {
            /** @var User */
            return $this->security->getUser();
        }

        $targetUser = $this->userRepository->find($id);
        if ($this->authorizationCheckerInterface->isGranted(UserVoter::VIEW, $targetUser)) {
            return $targetUser;
        }

        throw new AccessDeniedHttpException();
    }
}
