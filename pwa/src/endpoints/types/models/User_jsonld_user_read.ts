/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type User_jsonld_user_read = {
    readonly '@context'?: (string | Record<string, any>);
    readonly '@id'?: string;
    readonly '@type'?: string;
    id?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    photoSmallUrl?: string | null;
    zone?: string | null;
    doorNumber?: string | null;
    roles?: 'voter' | 'chairman' | 'member';
};

