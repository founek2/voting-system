/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Election_jsonld_election_read = {
    readonly '@context'?: (string | Record<string, any>);
    readonly '@id'?: string;
    readonly '@type'?: string;
    readonly id?: number;
    announcementDate?: string;
    registrationOfCandidatesDate?: string | null;
    campaignDate?: string | null;
    electronicVotingDate?: string | null;
    ballotVotingDate?: string | null;
    preliminaryResultsDate?: string | null;
    complaintsDeadlineDate?: string | null;
    finalResultsDate?: string | null;
    candidates?: Array<string>;
    positions?: Array<string>;
    readonly stage?: 'announcement' | 'registration_of_candidates' | 'campaign' | 'electronic_voting' | 'ballot_voting' | 'preliminary_results' | 'complaints' | 'final_results';
};

