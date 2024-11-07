<?php

namespace App\Tests\Service;

use App\Entity\User;
use App\Services\ISProvider;
use App\Tests\Fixtures\ApiTestCaseClient;

class IsProviderTest extends ApiTestCaseClient
{
    // public function testGetOAuthUrl(): void
    // {
    //     /** @var ISProvider */
    //     $provider = self::getContainer()->get(ISProvider::class);

    //     echo $provider->getAuthorizationUrl() . "\n";

    //     $token = $provider->getAccessToken('authorization_code', ['code' => '31d893c6548a28f6598dff089dd6158f9df01bf2720bc22a0d01ee74f3894ec8']);

    //     /** @var User */
    //     $owner = $provider->getResourceOwner($token);
    // }
}
