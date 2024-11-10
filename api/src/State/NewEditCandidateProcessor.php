<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Candidate;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class NewEditCandidateProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $entityManager,
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
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Candidate
    {
        if (!$data instanceof Candidate) {
            throw new \InvalidArgumentException('Data must be an instance of ' . Candidate::class);
        }

        $user = $this->security->getUser();
        $data->setAppUser($user);

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
