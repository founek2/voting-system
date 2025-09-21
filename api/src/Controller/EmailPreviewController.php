<?php

namespace App\Controller;

use App\Const\FinancialAccountType;
use App\Const\InvoiceType;
use App\Entity\Address;
use App\Entity\File\File;
use App\Entity\Finance\FinancialTransaction;
use App\Entity\Warehouse;
use App\Factory\CommissionPointsLedgerFactory;
use App\Factory\CountryFactory;
use App\Factory\FinancialAccountFactory;
use App\Factory\Invoice\InvoiceFactory;
use App\Service\EmailHelperService;
use App\Service\InvoiceAccessService;
use App\Service\QrCodeService;
use App\Util\AmountUtil;
use App\Util\NullableUtil;
use DateInterval;
use DateTime;
use PHPUnit\Event\Telemetry\Duration;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;

use function PHPUnit\Framework\assertNotNull;

#[AsController]
class EmailPreviewController extends AbstractController
{
    public function __construct(private string $homepageUrl, private string $votingUrl) {}

    public function __invoke(): Response
    {
        $templates = [
            'election_notification/election-notification.html.twig',
        ];

        $parameters = [
            'votingUrl' => $this->votingUrl,
            'homePageUrl' => $this->homepageUrl,
            'startDate' => new DateTime(),
            'endDate' => new DateTime('now +10 day'),
        ];

        $result = '';
        $counter = 0;
        $items = [];
        foreach ($templates as $key => $item) {
            ++$counter;
            if ($counter !== 1) {
                // continue;
            }
            $result .= '<h2 style="color:#fff; font-size:18px; padding:20px 3px 3px 3px; display:flex; justify-content: center; align-items: center; border-top:2px solid #333; ">
                        <span style="height:30px; width:30px; line-height: 30px; font-weight: bold; border-radius:50%; background:#333; color:#fff; margin-right:5px;font-size: 12px; text-align: center;">' . $counter . '</span>' . $item . '</h2>';
            $items[] = [str_replace('.html.twig', '', $item), $this->renderView(
                $item,
                $parameters
            )];
        }

        $result = $this->renderView(
            'email_preview/index.html.twig',
            [
                'emails' => $items,
            ]
        );

        return new Response(
            $result
        );
    }
}
