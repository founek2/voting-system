import { api } from './api';
import { BallotResource_jsonld_vote_write } from './types';

export const ballotApi = api.injectEndpoints({
    endpoints: (build) => ({
        addBallotVote: build.mutation<undefined, BallotResource_jsonld_vote_write>({
            query(body) {
                return {
                    url: `ballot/vote`,
                    method: 'POST',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Ballot', 'Votes'],
        }),

    }),
});

export const { useAddBallotVoteMutation } = ballotApi;