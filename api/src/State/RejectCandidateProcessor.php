<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Candidate;
use DateTimeImmutable;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class RejectCandidateProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface           $persistProcessor,
    ) {}

    /**
     * @param Candidate $data
     * @param Operation $operation
     * @param array $uriVariables
     * @param array $context
     * @return Candidate
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if (!$data instanceof Candidate) {
            throw new \InvalidArgumentException('Data must be an instance of ' . Candidate::class);
        }

        if ($data->getWinnerMarkedAt() == null) {
            $data->setRejectedAt(new DateTimeImmutable());
        }

        $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
