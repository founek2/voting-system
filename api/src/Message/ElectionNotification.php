<?php

namespace App\Message;

class ElectionNotification
{
    public function __construct(
        private int $electionId,
        private string $email,
    ) {}

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getElectionId(): string
    {
        return $this->electionId;
    }
}
