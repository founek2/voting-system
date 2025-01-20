import { Hydra } from '../types';
import { api } from './api';
import { LoginResource_jsonld_code_write, LoginResource_jsonld_url_read, LoginResource_LoginResponseDto_jsonld, User_jsonld_user_read } from './types';

export const usersApi = api.injectEndpoints({
    endpoints: (build) => ({
        getUserMe: build.query<User_jsonld_user_read, void>({
            query: () => `users/me`,
            providesTags: ['UserMe'],
        }),
        getVotedForElection: build.query<Hydra<User_jsonld_user_read>, { electionId: string, zoneId?: string }>({
            query: ({ electionId, zoneId }) => ({
                url: 'users',
                params: {
                    'votes.candidate.election': electionId,
                    'exists[votes.invalidatedAt]': false,
                    'perPage': 2000,
                    'zone': zoneId

                }
            }),
            providesTags: ['Votes', 'Users'],
        }),
    }),
});

export const { useGetUserMeQuery, useGetVotedForElectionQuery } = usersApi;