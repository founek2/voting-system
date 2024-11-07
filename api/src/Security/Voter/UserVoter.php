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
    const VIEW_TREE = 'VIEW_TREE';

    public function __construct(private Security $security, private LoggerInterface $logger,) {}

    protected function supports($attribute, $subject): bool
    {
        $supportsAttribute = in_array($attribute, [self::EDIT, self::VIEW, self::VIEW_TREE]);
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
                if ($subject === $user || $user->hasRole(Role::CHAIRMAN)) {
                    return true;
                }
                break;
            case self::VIEW:
                if ($subject === $user || $user->hasRole(Role::CHAIRMAN)) {
                    return true;
                }
        }

        return false;
    }
}
