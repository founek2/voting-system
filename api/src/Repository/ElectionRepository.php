<?php

namespace App\Repository;

use App\ApiResource\ElectionResultResource;
use App\Const\VoteValue;
use App\Dto\CandidateResult;
use App\Entity\Candidate;
use App\Entity\Election;
use App\Entity\Vote;
use App\State\ElectionResultProvider;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Election>
 */
class ElectionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Election::class);
    }

    /** @param Candidate[] $candidates */
    public function calculateResult(array $candidates): ElectionResultResource
    {
        // TODO calculate result per candidate
        $results = [];
        foreach ($candidates as $candidate) {
            $negativeVotes = $this->countVotes(VoteValue::Negative, $candidate);
            $positiveVotes = $this->countVotes(VoteValue::Positive, $candidate);
            $neutralVotes = $this->countVotes(VoteValue::Neutral, $candidate);
            $results[] = new CandidateResult($candidate, $positiveVotes, $negativeVotes, $neutralVotes);
        }

        return new ElectionResultResource($candidate->getElection()->getId(), $results);
    }

    public function countVotes(VoteValue $value, Candidate $candidate): int
    {
        return $this->createQueryBuilder('e')
            ->select('COUNT(v.id)')
            ->from(Vote::class, 'v')
            ->innerJoin('v.candidate', 'c')
            ->andWhere('v.value = :val')
            ->andWhere('v.invalidatedAt IS NULL')
            ->andWhere('c = :candidate')
            ->setParameter('val', $value)
            ->setParameter('candidate', $candidate)
            ->getQuery()
            ->getSingleScalarResult();;
    }



    //    public function findOneBySomeField($value): ?Election
    //    {
    //        return $this->createQueryBuilder('e')
    //            ->andWhere('e.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
