import { api } from './api';
import { LoginResource_jsonld_code_write, LoginResource_jsonld_url_read, LoginResource_LoginResponseDto_jsonld } from './types';

export const signInApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAuthorizationUrl: build.query<LoginResource_jsonld_url_read, void>({
            query: () => `login`,
            providesTags: ['AuthorizationUrl'],
        }),
        signIn: build.mutation<LoginResource_LoginResponseDto_jsonld, LoginResource_jsonld_code_write>({
            query(body) {
                return {
                    url: `login`,
                    method: 'POST',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['SignIn'],
        }),

    }),
});

export const { useSignInMutation, useGetAuthorizationUrlQuery } = signInApi;