<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Validator\ValidatorInterface;
use App\ApiResource\LoginResource;
use App\Dto\LoginResponseDto;
use App\Entity\User;
use App\Services\ISProvider;
use App\Services\UserService;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class LoginProcessor implements ProcessorInterface
{
    public function __construct(
        private ISProvider $iSProvider,
        private UserService $userService,
        private JWTTokenManagerInterface $jwt,
        private ValidatorInterface $validator,
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
        $this->userService->refresh($user, $token);

        return new LoginResponseDto($this->jwt->create($user),  $user->getAccessToken()->getExpires());
    }
}
