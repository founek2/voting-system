/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Candidate_jsonld_candidate_read } from './Candidate_jsonld_candidate_read';
export type CandidateResult_jsonld_candidate_read = {
    readonly '@context'?: (string | Record<string, any>);
    readonly '@id'?: string;
    readonly '@type'?: string;
    candidate?: Candidate_jsonld_candidate_read;
    positiveVotes?: number;
    negativeVotes?: number;
    neutralVotes?: number;
};

