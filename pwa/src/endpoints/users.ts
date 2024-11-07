import { api } from './api';
import { LoginResource_jsonld_code_write, LoginResource_jsonld_url_read, LoginResource_LoginResponseDto_jsonld, User_jsonld_user_read } from './types';

export const usersApi = api.injectEndpoints({
    endpoints: (build) => ({
        getUserMe: build.query<User_jsonld_user_read, void>({
            query: () => `users/me`,
            providesTags: ['UserMe'],
        }),

    }),
});

export const { useGetUserMeQuery } = usersApi;