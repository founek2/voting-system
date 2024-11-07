<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Validator\ValidatorInterface;
use App\ApiResource\LoginResource;
use App\Dto\LoginResponseDto;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Services\ISProvider;
use App\Services\UserService;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class LoginProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private UserRepository $userRepository,
        private AuthorizationCheckerInterface $authorizationCheckerInterface,
        private ISProvider $iSProvider,
        private ValidatorInterface $validator,
        private UserService $userService,
    ) {}

    /**
     * @param LoginResource $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): LoginResponseDto
    {
        if (!$data instanceof LoginResource) {
            throw new \InvalidArgumentException('Data must be an instance of ' . LoginResource::class);
        }

        $token = $this->iSProvider->getAccessToken('authorization_code', ['code' => $data->getCode()]);

        /** @var User */
        $user = $this->iSProvider->getResourceOwner($token);
        $this->userService->refresh($user);

        return new LoginResponseDto($user->getAccessToken()->getToken(),  $user->getAccessToken()->getExpires());
        // return new Response(
        //     \json_encode([
        //         'accessToken' => $user->getAccessToken()->getToken(),
        //     ], JSON_THROW_ON_ERROR),
        //     200,
        //     ['Content-Type' => 'application/json']
        // );
    }
}
