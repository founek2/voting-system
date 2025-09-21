/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HydraCollectionBaseSchema = {
    member: any[];
    totalItems?: number;
    view?: {
        '@id'?: string;
        '@type'?: string;
        first?: string;
        last?: string;
        previous?: string;
        next?: string;
    };
    search?: {
        '@type'?: string;
        template?: string;
        variableRepresentation?: string;
        mapping?: Array<{
            '@type'?: string;
            variable?: string;
            property?: string | null;
            required?: boolean;
        }>;
    };
};

