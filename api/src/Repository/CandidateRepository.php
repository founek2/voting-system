<?php

namespace App\Repository;

use App\Entity\Candidate;
use App\Entity\Election;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Candidate>
 */
class CandidateRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Candidate::class);
    }

    //    /**
    //     * @return Candidate[] Returns an array of Candidate objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    public function findOneByElectionAndUser(Election $election, User $appUser): ?Candidate
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.election = :election')
            ->andWhere('c.appUser = :user')
            ->andWhere('c.withdrewAt IS NULL')
            ->setParameter('election', $election)
            ->setParameter('user', $appUser)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    /** @return Candidate[] */
    public function findByElection(Election $election): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.election = :election')
            ->andWhere('c.withdrewAt IS NULL')
            ->setParameter('election', $election)
            ->getQuery()
            ->getResult()
        ;
    }
}
