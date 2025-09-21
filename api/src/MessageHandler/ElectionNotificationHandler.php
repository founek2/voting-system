<?php

namespace App\MessageHandler;

use App\Mailing\SendElectionNotificationeEmail;
use App\Message\ElectionNotification;
use App\Repository\ElectionRepository;
use App\Util\NullableUtil;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class ElectionNotificationHandler
{
    public function __construct(
        private ElectionRepository $electionRepository,
        private SendElectionNotificationeEmail $sender,
    ) {}

    public function __invoke(ElectionNotification $message)
    {
        $election = $this->electionRepository->find($message->getElectionId());
        NullableUtil::notNullOrThrow($election);

        ($this->sender)($election, $message->getEmail());
    }
}
