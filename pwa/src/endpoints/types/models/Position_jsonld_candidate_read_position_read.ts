/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Candidate_jsonld_candidate_read_position_read } from './Candidate_jsonld_candidate_read_position_read';
export type Position_jsonld_candidate_read_position_read = {
    readonly '@context'?: (string | Record<string, any>);
    readonly '@id'?: string;
    readonly '@type'?: string;
    readonly id?: number;
    zoneRestrictions?: Array<string>;
    candidates?: Array<Candidate_jsonld_candidate_read_position_read>;
    name?: string;
    elections?: Array<string>;
};

