import { api } from './api';
import { Election, Hydra } from '../types';
import { BallotResult_jsonld_result_read_candidate_read, BallotResult_jsonld_result_write, Election_jsonld_election_write, ElectionResultResource_jsonld_candidate_read } from './types';
import { FormType } from '../Components/VoteResultRow';

export const signInApi = api.injectEndpoints({
    endpoints: (build) => ({
        getElectionBallotResult: build.query<Hydra<BallotResult_jsonld_result_read_candidate_read>, number>({
            query: (id) => ({
                url: `ballot_results`,
                query: {
                    'candidate.election.id': id,
                }
            }),
            providesTags: ['Ballot'],
            transformResponse: (data: Hydra<BallotResult_jsonld_result_read_candidate_read>) => {
                data.member?.sort((a, b) => {
                    return (a.candidate?.position.id ?? 0) - (b.candidate?.position.id ?? 0);
                })

                return data;
            }
        }),
        addBallotResult: build.mutation<BallotResult_jsonld_result_read_candidate_read, BallotResult_jsonld_result_write>({
            query(body) {
                return {
                    url: `ballot_results`,
                    method: 'POST',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Ballot'],
        }),
        updateBallotResult: build.mutation<BallotResult_jsonld_result_read_candidate_read, { id: number, body: BallotResult_jsonld_result_write }>({
            query({ id, body }) {
                return {
                    url: `ballot_results/${id}`,
                    method: 'PATCH',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Ballot'],
        }),
        saveBallotResult: build.mutation<void, FormType>({
            async queryFn(data, _queryApi, _extraOptions, baseQuery) {
                for (const result of data.candidates) {
                    const resultConverted: BallotResult_jsonld_result_write = {
                        candidate: result.candidate,
                        negativeVotes: Number(result.negativeVotes),
                        neutralVotes: Number(result.neutralVotes),
                        positiveVotes: Number(result.positiveVotes),
                    };
                    if (result.resultId) {
                        const { error } = await baseQuery({
                            url: `ballot_results/${result.resultId}`,
                            method: 'PATCH',
                            body: JSON.stringify(resultConverted),
                        });
                        if (error) {
                            return { error };
                        }
                    } else {
                        const { error } = await baseQuery({
                            url: `ballot_results`,
                            method: 'POST',
                            body: JSON.stringify(resultConverted),
                        });

                        if (error) {
                            return { error };
                        }
                    }
                }
                return { data: undefined };
            },
            invalidatesTags: ['Ballot'],
        })
    }),

});

export const {
    useGetElectionBallotResultQuery,
    useAddBallotResultMutation,
    useUpdateBallotResultMutation,
    useSaveBallotResultMutation
} = signInApi;