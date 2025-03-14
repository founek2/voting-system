<?php

declare(strict_types=1);

namespace App\Const;

enum ElectionStage: string
{
    case ANNOUNCEMENT = 'announcement';
    case REGISTRATION_OF_CANDIDATES = 'registration_of_candidates';
    case CAMPAIGN = 'campaign';
    case ELECTRONIC_VOTING = 'electronic_voting';
    case BALLOG_VOTING = 'ballot_voting';
    case PRELIMINARY_RESULTS = 'preliminary_results';
    case COMPLAINTS = 'complaints';
    case COUNTING_VOTES = 'counting_votes';
    case FINAL_RESULTS = 'final_results';
}
