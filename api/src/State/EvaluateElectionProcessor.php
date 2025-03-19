<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Election;
use DateTimeImmutable;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class EvaluateElectionProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface           $persistProcessor,
    ) {}

    /**
     * @param Election $data
     * @param Operation $operation
     * @param array $uriVariables
     * @param array $context
     * @return void
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if (!$data instanceof Election) {
            throw new \InvalidArgumentException('Data must be an instance of ' . Election::class);
        }

        $data->setEvaluatedAt(new DateTimeImmutable());

        $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
