<?php

namespace App\Tests\Fixtures;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Zenstruck\Foundry\Persistence\Proxy;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class ApiTestCaseClient extends ApiTestCase
{
    use ResetDatabase, Factories;

    /**
     * @param User $data
     * @return Client
     */
    protected static function createUserClient(User|Proxy $user): Client
    {
        $client = self::createClient();

        $client->setDefaultOptions([
            'auth_basic' => null,
            'auth_bearer' => null,
            'query' => [],
            'headers' => [
                'accept' => ['application/ld+json'],
                'Authorization' => sprintf('Bearer %s', $user->getAccessToken()->getToken()),
                'Accept-Language' => 'cs,sk;q=0.8,en-US;q=0.5,en;q=0.3'
            ],
            'body' => '',
            'json' => null,
            'base_uri' => 'http://localhost',
            'extra' => [],
        ]);

        return $client;
    }

    public static function assertJsonMemberCount(int $expectedCount,  string $message = ''): void
    {
        static::assertCount($expectedCount, self::getHttpResponseArray()["hydra:member"], $message);
    }

    public static function assertJsonMemberIds(array $expectedIds,  string $message = ''): void
    {
        $ids = array_map(fn($obj) => $obj['id'], self::getJsonMembers());
        sort($expectedIds);
        sort($ids);
        self::assertEquals($expectedIds, $ids, $message);
    }

    protected static function getHttpResponseArray(): array
    {
        if (!$response = self::getClient()->getResponse()) {
            static::fail('A client must have an HTTP Response to make assertions. Did you forget to make an HTTP request?');
        }

        return json_decode($response->getContent(), true);
    }

    protected static function getJsonMembers(): array
    {
        return self::getHttpResponseArray()["hydra:member"];
    }
}
