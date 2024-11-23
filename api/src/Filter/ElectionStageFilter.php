<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Const\ElectionStage;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;

final class ElectionStageFilter extends AbstractFilter
{
    public const ALLOWED_VALUES = [ElectionStage::ELECTRONIC_VOTING->value];
    const QUERY_PARAM_NAME = 'stage';

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
        if ($value == ElectionStage::ELECTRONIC_VOTING->value) {
            $queryBuilder
                ->andWhere(sprintf("%s.electronicVotingDate <= :now", $alias))
                ->andWhere(sprintf(":now < %s.ballotVotingDate", $alias));
        }

        $queryBuilder->setParameter("now", new DateTimeImmutable());
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
