<?php

namespace App\MessageHandler;

use App\Message\ElectionNotification;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class ElectionNotificationHandler
{
    public function __invoke(ElectionNotification $message) {}
}
