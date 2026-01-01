<?php

declare(strict_types=1);

namespace App\Services;

use App\Dto\LocationDto;
use App\Dto\RoleDto;
use App\Dto\UserServiceDto;
use App\Dto\ZoneDto;
use App\Repository\UserRepository;
use League\OAuth2\Client\Provider\AbstractProvider;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Token\AccessToken;
use Psr\Http\Message\ResponseInterface;
use Symfony\Component\Serializer\Normalizer\ArrayDenormalizer;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ISProvider extends AbstractProvider
{
    public function __construct(
        private string $oauthApiUri,
        private string $oauthUri,
        private UserRepository $userRepository,
        private DenormalizerInterface $normalizer,
        array $options = [],
        array $collaborators = [],
    ) {
        parent::__construct($options, $collaborators);
    }

    /**
     * Returns authorization headers for the 'bearer' grant.
     *
     * @param  AccessTokenInterface|string|null $token Either a string or an access token instance
     * @return array
     */
    protected function getAuthorizationHeaders($token = null)
    {
        return ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'];
    }

    public function getBaseAuthorizationUrl()
    {
        return $this->oauthUri . '/oauth/authorize';
    }

    public function getBaseAccessTokenUrl(array $params)
    {
        return $this->oauthUri . '/oauth/token';
    }

    public function getResourceOwnerDetailsUrl(AccessToken $token): string
    {
        return $this->oauthApiUri . '/v1/users/me';
    }

    public function getLocationUrl(): string
    {
        return $this->oauthApiUri . '/v1/rooms/mine';
    }

    public function getActiveServicesUrl(): string
    {
        return $this->oauthApiUri . '/v1/services/mine';
    }

    protected function getDefaultScopes()
    {
        return ['location'];
    }

    protected function getDefaultHeaders()
    {
        return [
            'content-type' => 'application/json'
        ];
    }

    protected function checkResponse(ResponseInterface $response, $data)
    {
        $status = $response->getStatusCode();
        if ($status != 200) {
            throw new IdentityProviderException(sprintf('Invalid status code: %s', $status),  $status, $response);
        }
    }

    protected function createResourceOwner(array $response, AccessToken $token)
    {
        $user = $this->userRepository->upsert(
            $response['id'],
            $response['username'],
            $response['email'],
            $response['first_name'],
            $response['surname'],
            $response['photo_file_small'],
            $token,
        );

        return $user;
    }

    public function getLocation(AccessToken $accessToken): LocationDto
    {
        $request = $this->getAuthenticatedRequest(self::METHOD_GET, $this->getLocationUrl(), $accessToken);
        $response = $this->getParsedResponse($request);
        $zone = $response['zone'];

        return new LocationDto(
            $response['id'],
            $response['door_number'],
            $response['floor'],
            $response['name'],
            new ZoneDto($zone['id'], $zone['name'], $zone['alias'], $zone['note'] ?? ''),
        );
    }

    public function getUserRolesUrl(): string
    {
        return $this->oauthApiUri . '/v1/user_roles/mine';
    }

    /** @return RoleDto[] */
    public function getUserRoles(AccessToken $accessToken): array
    {
        $request = $this->getAuthenticatedRequest(self::METHOD_GET, $this->getUserRolesUrl(), $accessToken);
        $response = $this->getParsedResponse($request);

        return array_map(fn($data) => new RoleDto($data['role'], $data['name'], $data['note'] ?? '', $data['name']), $response);
    }

    /** @return UserServiceDto[] */
    public function getUserActiveServices(AccessToken $accessToken): array
    {
        $request = $this->getAuthenticatedRequest(self::METHOD_GET, $this->getActiveServicesUrl(), $accessToken);
        $response = $this->getParsedResponse($request);

        $data = $this->normalizer->denormalize($response, UserServiceDto::class . '[]', 'json');
        return $data;
    }
}
