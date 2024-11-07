<?php

namespace App\Tests\Api;

use App\Factory\UserFactory;
use App\Repository\UserRepository;
use App\Tests\Fixtures\ApiTestCaseClient;
use League\OAuth2\Client\Token\AccessToken;

class UserRepositoryTest extends ApiTestCaseClient
{
    public function testFindByAccessKey(): void
    {
        $user = UserFactory::createOne(['accessToken' => new AccessToken(['access_token' => 'foo', 'expires_in' => -100])]);

        /** @var UserRepository */
        $repo = UserFactory::repository();

        $user = $repo->findByAccessToken('foo');
        self::assertNotNull($user);
        self::assertEquals('foo', $user->getAccessToken()->getToken());
        self::assertTrue($user->getAccessToken()->hasExpired());
    }
}
