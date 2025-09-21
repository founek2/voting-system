/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Unprocessable entity
 */
export type ConstraintViolation = {
    status?: number;
    violations?: Array<{
        /**
         * The property path of the violation
         */
        propertyPath?: string;
        /**
         * The message associated with the violation
         */
        message?: string;
    }>;
    readonly detail?: string;
    readonly type?: string;
    readonly title?: string | null;
    readonly instance?: string | null;
};

