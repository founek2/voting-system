<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Election;
use App\Entity\Position;
use App\Entity\User;
use App\Entity\Vote;
use DateTimeImmutable;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;

final class VoteCandidateFilter extends AbstractFilter
{
    const VOTED = 'voted';
    const UNVOTED = 'unvoted';
    public const ALLOWED_VALUES = [self::VOTED, self::UNVOTED];
    const QUERY_PARAM_NAME = 'type';

    public function __construct(
        ManagerRegistry $managerRegistry,
        private readonly Security $security,
        ?LoggerInterface $logger = null,
        ?array $properties = null,
        ?NameConverterInterface $nameConverter = null
    ) {
        parent::__construct($managerRegistry, $logger, $properties, $nameConverter);
    }

    /*
     * Filtered properties is accessible through getProperties() method: property => strategy
     */
    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        if ($property != self::QUERY_PARAM_NAME) {
            return;
        }

        if (!in_array($value, self::ALLOWED_VALUES)) {
            return;
        }

        $alias = $queryBuilder->getRootAliases()[0];

        $nowParam = $queryNameGenerator->generateParameterName('now');
        $qb = $queryBuilder->getEntityManager()->createQueryBuilder();
        $votingElectionsSubQuery = $qb->select('e.id')
            ->from(Election::class, 'e')
            ->andWhere(sprintf('e.electronicVotingDate <= :%s', $nowParam))
            ->andWhere(sprintf(':%s < e.ballotVotingDate', $nowParam));

        $queryBuilder
            ->andWhere($queryBuilder->expr()->in(sprintf('IDENTITY(%s.election)', $alias), $votingElectionsSubQuery->getDQL()))
            ->setParameter($nowParam, new DateTimeImmutable());

        /** @var User */
        $user = $this->security->getUser();
        $userParam = $queryNameGenerator->generateParameterName('user');
        $qb = $queryBuilder->getEntityManager()->createQueryBuilder();
        $votedCandidatesSubQuery = $qb->select('IDENTITY(v.candidate)')
            ->from(Vote::class, 'v')
            ->andWhere(sprintf('IDENTITY(v.appUser) = :%s', $userParam));

        $zoneParam = $queryNameGenerator->generateParameterName('zone');
        $qb = $queryBuilder->getEntityManager()->createQueryBuilder();
        $allowedPositionsSubQuery = $qb->select('p.id')
            ->from(Position::class, 'p')
            ->leftJoin('p.zoneRestrictions', 'zone')
            ->andWhere(sprintf('zone = :%s OR zone IS NULL', $zoneParam));

        $queryBuilder
            ->andWhere($queryBuilder->expr()->in(sprintf('IDENTITY(%s.position)', $alias), $allowedPositionsSubQuery->getDQL()));

        if ($value == self::VOTED) {
            $queryBuilder
                ->andWhere($queryBuilder->expr()->in(sprintf('%s.id', $alias), $votedCandidatesSubQuery->getDQL()));
        } else if ($value == self::UNVOTED) {
            $queryBuilder
                ->andWhere($queryBuilder->expr()->notIn(sprintf('%s.id', $alias), $votedCandidatesSubQuery->getDQL()));
        }

        $queryBuilder->setParameter($userParam, $user->getId());
        $queryBuilder->setParameter($zoneParam, $user->getZone());
    }
    /*
     * This function is only used to hook in documentation generators (supported by Swagger and Hydra).
     */
    public function getDescription(string $resourceClass): array
    {
        $description = [];

        $description[sprintf('%s', self::QUERY_PARAM_NAME)] = [
            'property' => self::QUERY_PARAM_NAME,
            'type' => 'string',
            'required' => false,
            'schema' => ['type' => 'string', 'enum' =>  self::ALLOWED_VALUES]
        ];

        return $description;
    }
}
