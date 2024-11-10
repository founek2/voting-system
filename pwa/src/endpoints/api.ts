import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import internalStorage from '../storage/internalStorage';

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    headers: {
        "Content-type": "application/ld+json"
    },
    prepareHeaders: async (headers, { endpoint }) => {
        // By default, if we have a token in the store, let's use that for authenticated requests
        const accessToken = internalStorage.getAccessToken()
        if (!accessToken) return headers

        if (!endpoint.startsWith('getPublic'))
            headers.set('Authorization', `Bearer ${accessToken.accessToken}`);

        return headers;
    },
});

// const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 });

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded
 */
export const api = createApi({
    /**
     * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
     */
    baseQuery,
    /**
     * Tag types must be defined in the original API definition
     * for any tags that would be provided by injected endpoints
     */
    tagTypes: [
        'SignIn',
        'AuthorizationUrl',
        'UserMe',
        'Elections',
        'Positions',
        'Zones',
        'PublicElections',
        'Candidates',
        'MediaPosters',
    ],
    /**
     * This api has endpoints injected in adjacent files,
     * which is why no endpoints are shown below.
     * If you want all endpoints defined in the same file, they could be included here instead
     */
    endpoints: () => ({}),
});

export const enhancedApi = api.enhanceEndpoints({});