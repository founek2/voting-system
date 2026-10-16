<?php

declare(strict_types=1);

namespace App\Tests\Integration;

use ApiPlatform\Doctrine\Orm\Extension\ParameterExtension;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGenerator;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Resource\Factory\ResourceMetadataCollectionFactoryInterface;
use ApiPlatform\State\Provider\ParameterProvider;
use ApiPlatform\State\ParameterProvider\IriConverterParameterProvider;
use App\Entity\BallotResult;
use App\Entity\Candidate;
use App\Entity\Election;
use App\Entity\User;
use App\Entity\Vote;
use App\Entity\Zone;
use Doctrine\ORM\QueryBuilder;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ServiceLocator;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class FilterParametersTest extends KernelTestCase
{
    public function testOperationsInheritResourceParameters(): void
    {
        $factory = self::getContainer()->get(ResourceMetadataCollectionFactoryInterface::class);

        foreach ([Candidate::class, Election::class, User::class, Vote::class, BallotResult::class] as $class) {
            foreach ($factory->create($class) as $resource) {
                foreach ($resource->getOperations() as $operation) {
                    self::assertEmpty($operation->getFilters(), $class);
                    foreach ($resource->getParameters() as $key => $parameter) {
                        self::assertTrue($operation->getParameters()->has($key, $parameter::class), "$class $key");
                    }
                }
            }
        }
    }

    #[DataProvider('searchFilters')]
    public function testSearchFilters(string $class, string $path, string $property, string|array $value): void
    {
        $query = $this->filteredQuery($class, $path, [$property => $value]);

        self::assertNotEmpty($query->getDQLPart('where'));
        self::assertCount(1, $query->getParameters());
        self::assertEquals((array) $value, (array) $query->getParameters()->first()->getValue());
    }

    public static function searchFilters(): iterable
    {
        foreach ([
            [Candidate::class, '/candidates', ['appUser', 'position']],
            [User::class, '/users', ['votes.candidate.election', 'votes.candidate.position', 'zone']],
            [Vote::class, '/votes', ['candidate.election', 'appUser', 'appUser.zone']],
            [BallotResult::class, '/ballot_results', ['candidate.election', 'candidate.election.id']],
        ] as [$class, $path, $properties]) {
            foreach ($properties as $property) {
                yield "$path $property scalar" => [$class, $path, $property, '12'];
                yield "$path $property array" => [$class, $path, $property, ['12', '34']];
            }
        }
    }

    public function testRelationFilterStillAcceptsIris(): void
    {
        $query = $this->filteredQuery(Candidate::class, '/candidates', ['election' => '/api/elections/12']);

        self::assertNotEmpty($query->getDQLPart('where'));
        self::assertEquals(12, $query->getParameters()->first()->getValue());
    }

    public function testRelationFilterAcceptsIriArrays(): void
    {
        $query = $this->filteredQuery(Candidate::class, '/candidates', [
            'election' => ['/api/elections/12', '/api/elections/34'],
        ]);

        self::assertStringContainsString('o.election IN', $query->getDQL());
        $elections = $query->getParameters()->first()->getValue();
        self::assertSame([12, 34], array_map(fn (Election $election) => $election->getId(), $elections));
    }

    #[DataProvider('existenceFilters')]
    public function testExistenceFilters(string $class, string $path, string $property, bool $exists): void
    {
        $query = $this->filteredQuery($class, $path, ['exists' => [$property => $exists ? 'true' : 'false']]);

        self::assertStringContainsString($exists ? 'IS NOT NULL' : 'IS NULL', $query->getDQL());
    }

    public static function existenceFilters(): iterable
    {
        foreach ([
            [Candidate::class, '/candidates', ['withdrewAt', 'rejectedAt', 'winnerMarkedAt']],
            [User::class, '/users', ['votes.invalidatedAt']],
            [Vote::class, '/votes', ['invalidatedAt']],
        ] as [$class, $path, $properties]) {
            foreach ($properties as $property) {
                foreach ([true, false] as $exists) {
                    yield "$path $property ".($exists ? 'exists' : 'missing') => [$class, $path, $property, $exists];
                }
            }
        }
    }

    public function testElectronicVotingStage(): void
    {
        foreach (['/elections', '/public/elections'] as $path) {
            $query = $this->filteredQuery(Election::class, $path, ['stage' => 'electronic_voting']);

            self::assertStringContainsString('o.electronicVotingDate <= :now', $query->getDQL());
            self::assertStringContainsString(':now < o.ballotVotingDate', $query->getDQL());
            self::assertInstanceOf(\DateTimeImmutable::class, $query->getParameter('now')->getValue());
        }
    }

    #[DataProvider('candidateTypes')]
    public function testCandidateVotingFilter(string $type, string $operator): void
    {
        $container = self::getContainer();
        $user = (new User())->setId(42)->setZone((new Zone())->setId(8))->setDoorNumber('308B');
        $container->get('security.token_storage')->setToken(new UsernamePasswordToken($user, 'main', []));

        $query = $this->filteredQuery(Candidate::class, '/elections/{id}/candidates', ['type' => $type]);

        self::assertStringContainsString("o.id $operator(SELECT IDENTITY(v.candidate)", $query->getDQL());
        self::assertStringContainsString('o.election', $query->getDQL());
        self::assertStringContainsString('o.position', $query->getDQL());
        self::assertCount(4, $query->getParameters());
        self::assertSame(42, $query->getParameter('user_p2')->getValue());
        self::assertTrue($query->getParameter('livesAtStrahov_p4')->getValue());
    }

    public static function candidateTypes(): iterable
    {
        yield 'voted' => ['voted', 'IN'];
        yield 'unvoted' => ['unvoted', 'NOT IN'];
    }

    public function testMissingAndUnknownCustomValuesRemainUnfiltered(): void
    {
        foreach ([
            [Election::class, '/elections', []],
            [Election::class, '/elections', ['stage' => 'unknown']],
            [Candidate::class, '/elections/{id}/candidates', []],
            [Candidate::class, '/elections/{id}/candidates', ['type' => 'unknown']],
            [Candidate::class, '/public/elections/{id}/candidates', ['type' => 'voted']],
        ] as [$class, $path, $parameters]) {
            self::assertEmpty($this->filteredQuery($class, $path, $parameters)->getDQLPart('where'));
        }
    }

    private function filteredQuery(string $class, string $path, array $parameters): QueryBuilder
    {
        $container = self::getContainer();
        $factory = $container->get(ResourceMetadataCollectionFactoryInterface::class);
        $operation = null;
        foreach ($factory->create($class) as $resource) {
            foreach ($resource->getOperations() as $candidate) {
                if ($candidate instanceof GetCollection && '/'.ltrim(str_replace('{._format}', '', $candidate->getUriTemplate()), '/') === $path) {
                    $operation = clone $candidate;
                    break 2;
                }
            }
        }
        self::assertNotNull($operation, $path);

        $request = Request::create($path.'?'.http_build_query($parameters));
        $locator = new ServiceLocator([
            IriConverterParameterProvider::class => fn () => $container->get('api_platform.state_provider.parameter.iri_converter'),
        ]);
        (new ParameterProvider(locator: $locator))->provide($operation, context: ['request' => $request]);
        $operation = $request->attributes->get('_api_operation');
        $query = $container->get('doctrine')->getManager()->createQueryBuilder()->select('o')->from($class, 'o');
        $container->get(ParameterExtension::class)->applyToCollection($query, new QueryNameGenerator(), $class, $operation);

        return $query;
    }
}
