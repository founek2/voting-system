/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HydraItemBaseSchema } from './HydraItemBaseSchema';
/**
 * A representation of common errors.
 */
export type Error_jsonld = (HydraItemBaseSchema & {
    /**
     * A short, human-readable summary of the problem.
     */
    readonly title?: string | null;
    /**
     * A human-readable explanation specific to this occurrence of the problem.
     */
    readonly detail?: string | null;
    status?: number | null;
    /**
     * A URI reference that identifies the specific occurrence of the problem. It may or may not yield further information if dereferenced.
     */
    readonly instance?: string | null;
    /**
     * A URI reference that identifies the problem type
     */
    readonly type?: string;
    readonly description?: string | null;
});

