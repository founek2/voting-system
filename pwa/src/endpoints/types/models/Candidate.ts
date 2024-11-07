/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Vote } from './Vote';
export type Candidate = {
    readonly id?: number;
    election?: string;
    appUser?: string;
    votes?: Array<Vote>;
    createdAt?: string;
    updatedAt?: string;
};

