<?php

namespace App\Security;

use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class AccessTokenHandler implements AccessTokenHandlerInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private JWTEncoderInterface $jwtEncoder
    ) {}

    public function getUserBadgeFrom(string $accessToken): UserBadge
    {
        try {
            $decoded = $this->jwtEncoder->decode($accessToken);
        } catch (JWTDecodeFailureException $ex) {
            $reason = $ex->getReason();
            if ($reason == JWTDecodeFailureException::EXPIRED_TOKEN) {
                throw new BadCredentialsException('Token expired.');
            } else {
                throw new BadCredentialsException('Invalid credentials.');
            }
        }


        $user = $this->userRepository->find($decoded['id']);
        if (is_null($user)) {
            throw new BadCredentialsException('Invalid credentials.');
        }

        // and return a UserBadge object containing the user identifier from the found token
        // (this is the same identifier used in Security configuration)
        return new UserBadge($user->getId());
    }
}
