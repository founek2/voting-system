<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\FilterInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Const\ElectionStage;
use DateTimeImmutable;
use Doctrine\ORM\QueryBuilder;

final class ElectionStageFilter implements FilterInterface
{
    public const ALLOWED_VALUES = [ElectionStage::ELECTRONIC_VOTING->value];
    const QUERY_PARAM_NAME = 'stage';

    public function apply(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        $value = ($context['parameter'] ?? null)?->getValue();
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
