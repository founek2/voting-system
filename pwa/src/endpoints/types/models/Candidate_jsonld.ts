/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Vote_jsonld } from './Vote_jsonld';
export type Candidate_jsonld = {
    readonly '@context'?: (string | Record<string, any>);
    readonly '@id'?: string;
    readonly '@type'?: string;
    readonly id?: number;
    election?: string;
    appUser?: string;
    votes?: Array<Vote_jsonld>;
    createdAt?: string;
    updatedAt?: string;
};

