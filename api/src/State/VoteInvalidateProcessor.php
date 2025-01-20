<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Const\ElectionStage;
use App\Entity\Vote;
use DateTimeImmutable;
use Exception;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class VoteInvalidateProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface           $persistProcessor,
    ) {}

    /**
     * @param Vote $data
     * @param Operation $operation
     * @param array $uriVariables
     * @param array $context
     * @return Vote
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if (!$data instanceof Vote) {
            throw new \InvalidArgumentException('Data must be an instance of ' . Vote::class);
        }
        if ($data->getCandidate()->getElection()->getStage() == ElectionStage::FINAL_RESULTS) {
            throw new Exception('Unable to modify votes in finished election');
        }

        $data->setInvalidatedAt(new DateTimeImmutable());

        $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
