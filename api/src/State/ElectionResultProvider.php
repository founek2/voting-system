<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\ElectionResultResource;
use App\Repository\CandidateRepository;
use App\Repository\ElectionRepository;
use Exception;

class ElectionResultProvider implements ProviderInterface
{
    public function __construct(
        private ElectionRepository $electionRepository,
        private CandidateRepository $candidateRepository,
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ElectionResultResource
    {
        $election = $this->electionRepository->find($uriVariables['id']);
        $candidates = $this->candidateRepository->findByElection($election);
        $result = $this->electionRepository->calculateResult($candidates);

        return $result;
    }
}
