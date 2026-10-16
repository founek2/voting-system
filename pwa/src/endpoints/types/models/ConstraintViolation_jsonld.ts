/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HydraItemBaseSchema } from './HydraItemBaseSchema';
/**
 * Unprocessable entity
 */
export type ConstraintViolation_jsonld = (HydraItemBaseSchema & {
    status?: number;
    violations?: Array<{
        /**
         * The property path of the violation
         */
        propertyPath: string;
        /**
         * The message associated with the violation
         */
        message: string;
        /**
         * The code of the violation
         */
        code?: string;
        /**
         * An extra hint to understand the violation
         */
        hint?: string;
        /**
         * The serialized payload of the violation
         */
        payload?: Record<string, any>;
    }>;
    readonly detail?: string;
    readonly description?: string;
    readonly type?: string;
    readonly title?: string | null;
    readonly instance?: string | null;
});

