/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Election = {
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
    createdAt?: string;
    updatedAt?: string;
};
