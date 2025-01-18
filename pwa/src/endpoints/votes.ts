import { Hydra } from '../types';
import { api } from './api';
import { MediaPoster_jsonld_media_object_read, Position_jsonld_position_read, Position_position_write, Vote_jsonld_vote_read } from './types';

export const votesApi = api.injectEndpoints({
    endpoints: (build) => ({
        getVotesForElection: build.query<Hydra<Vote_jsonld_vote_read>, string>({
            query: (electionId) => `votes?candidate.election=${electionId}&perPage=2000`,
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

export const { useGetVotesForElectionQuery, useInvalidateVoteMutation } = votesApi;