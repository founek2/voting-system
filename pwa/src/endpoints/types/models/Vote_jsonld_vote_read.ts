/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User_jsonld_vote_read } from './User_jsonld_vote_read';
export type Vote_jsonld_vote_read = {
    readonly '@context'?: (string | Record<string, any>);
    readonly '@id'?: string;
    readonly '@type'?: string;
    readonly id?: number;
    candidate: string;
    appUser?: User_jsonld_vote_read;
    invalidatedAt?: string | null;
};

