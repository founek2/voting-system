<?php

declare(strict_types=1);

namespace App\Mailing;

use App\Entity\Election;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

class SendElectionNotificationeEmail
{

    public function __construct(
        private MailerInterface            $mailer,
        private string                     $votingUrl,
        private string                     $homepageUrl,
    ) {}

    /**
     * @throws TransportExceptionInterface
     */
    public function __invoke(Election $election, string $emailAddress): bool
    {

        $email = new TemplatedEmail();
        $email->to($emailAddress);
        $email->subject('Silicon Hill - Elektronicke volby / e-Elections');
        $email->htmlTemplate('election_notification/election-notification.html.twig');

        $ballowDate = new \Datetime($election->getBallotVotingDate()->format(\DateTimeInterface::ATOM));
        $email->context([
            'votingUrl' => $this->votingUrl,
            'homepageUrl' => $this->homepageUrl,
            'startDate' => $election->getElectronicVotingDate(),
            'endDate' => $ballowDate->modify('-1 day'),
        ]);

        $this->mailer->send($email);
        return true;
    }
}
