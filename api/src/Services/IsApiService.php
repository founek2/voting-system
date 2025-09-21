<?php

declare(strict_types=1);

namespace App\Services;

use App\Dto\UserEmailDto;
use Exception;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class IsApiService
{
    public function __construct(
        private HttpClientInterface $client,
        private SerializerInterface $serializer,
        private string $baseApiUri,
        private string $apiToken,
    ) {}

    /** @return UserEmailDto[] */
    public function fetchUserList(): array
    {
        $response = $this->client->request('GET', sprintf('%s/users/emails', $this->baseApiUri), [
            'query' => [
                'token' => $this->apiToken
            ]
        ]);
        if ($response->getStatusCode() > 299) {
            throw new Exception(sprintf('IS Api returned status "%s"', $response->getStatusCode()));
        }

        return $this->serializer->deserialize($response->getContent(), UserEmailDto::class, 'json');
    }
}
