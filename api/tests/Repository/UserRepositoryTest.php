<?php

namespace App\Tests\Repository;

use App\Factory\UserFactory;
use App\Dto\AccessTokenDto;
use App\Entity\User;
use App\Tests\Fixtures\ApiTestCaseClient;

class UserRepositoryTest extends ApiTestCaseClient
{
    public function testAccessTokenDtoIsPersisted(): void
    {
        $expires = time() - 3600;
        $user = UserFactory::createOne(['accessToken' => new AccessTokenDto(['expires' => $expires])]);
        $id = $user->getId();
        $manager = self::getContainer()->get('doctrine')->getManager();
        $manager->clear();

        $user = $manager->getRepository(User::class)->find($id);
        self::assertNotNull($user);
        self::assertInstanceOf(AccessTokenDto::class, $user->getAccessToken());
        self::assertSame($expires, $user->getAccessToken()->getExpires());
        self::assertTrue($user->getAccessToken()->hasExpired());
    }
}
