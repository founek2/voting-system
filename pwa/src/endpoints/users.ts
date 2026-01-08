import { Hydra } from '../types';
import { api } from './api';
import { LoginResource_jsonld_code_write, LoginResource_jsonld_url_read, LoginResource_LoginResponseDto_jsonld, User_jsonld_user_read } from './types';

export const usersApi = api.injectEndpoints({
    endpoints: (build) => ({
        getUserMe: build.query<User_jsonld_user_read, void>({
            query: () => `users/me`,
            providesTags: ['UserMe'],
        }),
        getVotedForElection: build.query<Hydra<User_jsonld_user_read>, { electionId: string, zoneId?: string, positionId?: string }>({
            query: ({ electionId, zoneId, positionId }) => ({
                url: 'users',
                params: {
                    'votes.candidate.election': electionId,
                    'exists[votes.invalidatedAt]': false,
                    'itemsPerPage': 2000,
                    'zone': zoneId,
                    'votes.candidate.position': positionId,

                }
            }),
            providesTags: ['Votes', 'Users'],
        }),
    }),
});

export const { useGetUserMeQuery, useGetVotedForElectionQuery } = usersApi;