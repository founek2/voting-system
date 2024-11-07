<?php

namespace App\Security;

use App\Repository\UserRepository;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class AccessTokenHandler implements AccessTokenHandlerInterface
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    public function getUserBadgeFrom(string $accessToken): UserBadge
    {
        $user = $this->userRepository->findByAccessToken($accessToken);
        if (is_null($user)) {
            throw new BadCredentialsException('Invalid credentials.');
        }

        if ($user->getAccessToken()->getExpires() && $user->getAccessToken()->hasExpired()) {
            throw new BadCredentialsException('Token expired.');
        }

        // and return a UserBadge object containing the user identifier from the found token
        // (this is the same identifier used in Security configuration)
        return new UserBadge($user->getId());
    }
}
