<?php

namespace App\Tests\Api;

use App\Factory\UserFactory;
use App\Tests\Fixtures\ApiTestCaseClient;
use League\OAuth2\Client\Token\AccessToken;

class UserTest extends ApiTestCaseClient
{
    public function testGetUser(): void
    {
        $user = UserFactory::createOne();

        $client = self::createUserClient($user);
        $client->request('GET', '/api/users/' . $user->getId());
        $this->assertResponseIsSuccessful();
    }

    public function testGetUserExpiredToken(): void
    {
        $user = UserFactory::createOne([
            'accessToken' => new AccessToken(['access_token' => '123', 'expires' => -1000]),
        ]);

        $client = self::createUserClient($user);
        $client->request('GET', '/api/users/' . $user->getId());
        $this->assertResponseStatusCodeSame(401);
    }
}
