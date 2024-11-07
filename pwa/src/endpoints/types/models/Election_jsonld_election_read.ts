/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Candidate_jsonld_election_read } from './Candidate_jsonld_election_read';
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
    candidates?: Array<Candidate_jsonld_election_read>;
    positions?: Array<string>;
};

