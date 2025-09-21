/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Candidate_jsonld_result_read_candidate_read } from './Candidate_jsonld_result_read_candidate_read';
import type { HydraItemBaseSchema } from './HydraItemBaseSchema';
export type BallotResult_jsonld_result_read_candidate_read = (HydraItemBaseSchema & {
    readonly id?: number;
    candidate?: Candidate_jsonld_result_read_candidate_read;
    positiveVotes?: number;
    negativeVotes?: number;
    neutralVotes?: number;
});

