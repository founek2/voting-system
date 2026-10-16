<?php

namespace App\Tests\Api;

use App\Factory\UserFactory;
use App\Dto\AccessTokenDto;
use App\Tests\Fixtures\ApiTestCaseClient;

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
            'accessToken' => new AccessTokenDto(['expires' => time() - 3600]),
        ]);

        $client = self::createUserClient($user);
        $client->request('GET', '/api/users/' . $user->getId());
        $this->assertResponseStatusCodeSame(401);
    }
}
