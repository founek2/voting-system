<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use League\OAuth2\Client\Token\AccessToken;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function upsert(int $id, string $username, string $email, string $firstName, string $lastName, string $photoSmallUrl, AccessToken $accessToken): ?User
    {
        $em = $this->getEntityManager();

        /** @var User|null */
        $user = $this->find($id);
        if ($user) {
            $this->update($user, $id,  $username,  $email, $firstName, $lastName, $photoSmallUrl, $accessToken);
        } else {
            $user = new User();
            $this->update($user, $id,  $username,  $email, $firstName, $lastName, $photoSmallUrl, $accessToken);
            $em->persist($user);
        }

        $em->flush();

        return $user;
    }

    private function update(User $user, int $id, string $username, string $email, string $firstName, string $lastName, string $photoSmallUrl, AccessToken $accessToken)
    {
        $user
            ->setId($id)
            ->setUsername($username)
            ->setEmail($email)
            ->setFirstName($firstName)
            ->setLastName($lastName)
            ->setAccessToken($accessToken)
            ->setPhotoSmallUrl($photoSmallUrl);
    }

    public function findByAccessToken(string $accessToken): ?User
    {
        $query = $this->createQueryBuilder('e')
            ->andWhere("JSON_GET_TEXT(e.accessToken, 'access_token') = :val")
            ->setParameter('val', $accessToken)
            ->getQuery();

        // echo $query->getSQL(), "\n";

        return $query->getOneOrNullResult();
    }
}
