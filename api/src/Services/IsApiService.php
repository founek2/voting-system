<?php

declare(strict_types=1);

namespace App\Services;

use App\Dto\UserEmailDto;
use Exception;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

function userAccountFilter(UserEmailDto $item): bool
{
    return $item->uid >= 1000;
}

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

        return $this->parseData($response->getContent());
    }

    /** @return UserEmailDto[] */
    public function parseData(string $content): array
    {
        $data = $this->serializer->deserialize($content, UserEmailDto::class . '[]', 'json');
        return array_filter($data, function (UserEmailDto $item) {
            return userAccountFilter($item);
        });
    }
}
