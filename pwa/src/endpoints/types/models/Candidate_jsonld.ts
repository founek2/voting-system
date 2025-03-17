/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Candidate_jsonld = {
    readonly id?: number;
    election?: string;
    appUser?: string;
    votes?: Array<string>;
    position?: string;
    poster?: string | null;
    withdrewAt?: string | null;
    rejectedAt?: string | null;
    ballotResults?: Array<string>;
    winnerMarkedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
    readonly withdrawAllowed?: boolean;
};

