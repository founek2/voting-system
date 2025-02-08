/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaReport_jsonld_election_read_media_read_url } from './MediaReport_jsonld_election_read_media_read_url';
import type { MediaResolution_jsonld_election_read_media_read_url } from './MediaResolution_jsonld_election_read_media_read_url';
export type Election_jsonld_election_read_media_read_url = {
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
    mediaResolutions?: Array<MediaResolution_jsonld_election_read_media_read_url>;
    mediaReports?: Array<MediaReport_jsonld_election_read_media_read_url>;
    readonly stage?: 'announcement' | 'registration_of_candidates' | 'campaign' | 'electronic_voting' | 'ballot_voting' | 'preliminary_results' | 'complaints' | 'final_results';
};

