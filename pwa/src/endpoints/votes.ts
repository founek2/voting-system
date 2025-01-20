import { Hydra } from '../types';
import { api } from './api';
import { Vote_jsonld_vote_read } from './types';

export const votesApi = api.injectEndpoints({
    endpoints: (build) => ({
        getVotesForElection: build.query<Hydra<Vote_jsonld_vote_read>, { electionId: string, zoneId?: string, userId?: string }>({
            query: ({ electionId, zoneId, userId }) => ({
                url: 'votes',
                params: {
                    'candidate.election': electionId,
                    'perPage': 2000,
                    'appUser.zone': zoneId,
                    'appUser': userId,
                    'exists[invalidatedAt]': false,
                }
            }),
            providesTags: ['Votes'],
        }),
        invalidateVote: build.mutation<void, number>({
            query(id) {
                return {
                    url: `votes/${id}/invalidate`,
                    method: 'POST',
                    body: JSON.stringify({}),
                };
            },
            invalidatesTags: ['Votes'],
        }),
    }),
});

export const { useGetVotesForElectionQuery, useInvalidateVoteMutation, useLazyGetVotesForElectionQuery } = votesApi;