<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\LoginResource;
use App\Services\ISProvider;

class LoginProvider implements ProviderInterface
{
    public function __construct(
        private ISProvider $iSProvider
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $authorizationUrl = $this->iSProvider->getAuthorizationUrl();
        $resource = new LoginResource();
        $resource->setAuthorizationUrl($authorizationUrl);

        return $resource;
    }
}
