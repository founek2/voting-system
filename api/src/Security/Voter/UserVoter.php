<?php

namespace App\Security\Voter;

use App\Entity\User;
use App\Const\Role;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class UserVoter extends Voter
{
    const EDIT = 'EDIT';
    const VIEW = 'VIEW';

    public function __construct(private Security $security, private LoggerInterface $logger,) {}

    protected function supports($attribute, $subject): bool
    {
        $supportsAttribute = in_array($attribute, [self::EDIT, self::VIEW]);
        $supportsSubject = $subject instanceof User;

        return $supportsAttribute && $supportsSubject;
    }

    /**
     * @param string $attribute
     * @param User $subject
     * @param TokenInterface $token
     * @return bool
     */
    protected function voteOnAttribute($attribute, $subject, TokenInterface $token): bool
    {
        /** @var User $user */
        $user = $token->getUser();

        switch ($attribute) {
            case self::EDIT:
                if ($subject->getId() === $user->getId() || $user->hasRole(Role::CHAIRMAN)) {
                    return true;
                }
                break;
            case self::VIEW:
                if ($subject->getId() === $user->getId() || $user->hasRole(Role::CHAIRMAN)) {
                    return true;
                }
        }

        return false;
    }
}
