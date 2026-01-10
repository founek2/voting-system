import { Candidate, Hydra } from '../types';
import { api } from './api';
import { Candidate_candidate_edit, Candidate_jsonld_candidate_write, Position_jsonld_position_read } from './types';

type ResultType = {
    candidateId: number;
    winner: boolean;
}[]

function orderByPosition(data: Hydra<Candidate>) {
    data.member?.sort((a, b) => {
        return (a.position.id ?? 0) - (b.position.id ?? 0);
    })

    return data;
}

export const signInApi = api.injectEndpoints({
    endpoints: (build) => ({
        getCandidates: build.query<Hydra<Candidate>, { election: string } | void>({
            query: (params) => ({
                url: `candidates`,
                params: params || undefined
            }),
            providesTags: ['Candidates'],
        }),
        getUserCandidates: build.query<Hydra<Candidate>, { userId: number, electionIds: string[] }>({
            query: ({ userId, electionIds }) => `users/${userId}/candidates?${electionIds.map(id => 'election[]=' + id).join("&")}`,
            providesTags: ['Candidates'],
        }),
        getCandidate: build.query<Candidate, number>({
            query: (id) => `candidates/${id}`,
            providesTags: ['Candidates'],
        }),
        getPublicCandidates: build.query<Hydra<Candidate>, number>({
            query: (electionId) => `public/elections/${electionId}/candidates`,
            providesTags: ['Candidates'],
            transformResponse: (data: Hydra<Candidate>) => {
                data.member.sort((a, b) => {
                    if (a.withdrewAt && !b.withdrewAt) {
                        return 1;
                    }
                    if (!a.withdrewAt && b.withdrewAt) {
                        return -1;
                    }
                    return 0
                })

                return data;
            }
        }),
        getPublicResultCandidates: build.query<Hydra<Candidate>, number>({
            query: (electionId) => ({
                url: `public/elections/${electionId}/candidates`,
                query: {
                    'exists[withdrewAt]': false,
                    'exists[rejectedAt]': false
                }
            }),
            providesTags: ['Candidates'],
            transformResponse: orderByPosition
        }),
        getCandidatesForElection: build.query<Hydra<Candidate>, number>({
            query: (electionId) => `elections/${electionId}/candidates`,
            providesTags: ['Candidates'],
            transformResponse: orderByPosition
        }),
        getCandidatesVoted: build.query<Hydra<Candidate>, number>({
            query: (electionId) => `elections/${electionId}/candidates?type=voted`,
            providesTags: ['Candidates', 'Votes'],
        }),
        getCandidatesUnvoted: build.query<Hydra<Candidate>, number>({
            query: (electionId) => `elections/${electionId}/candidates?type=unvoted`,
            providesTags: ['Candidates', 'Votes'],
            transformResponse: orderByPosition
        }),
        addCandidate: build.mutation<Candidate, { userId: number, body: Candidate_jsonld_candidate_write }>({
            query({ userId, body }) {
                return {
                    url: `candidates`,
                    method: 'POST',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Candidates', 'Elections'],
        }),
        updateCandidate: build.mutation<Position_jsonld_position_read, { id: number, body: Candidate_candidate_edit }>({
            query({ id, body }) {
                return {
                    url: `candidates/${id}`,
                    method: 'PATCH',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Candidates', 'Elections'],
        }),
        withdrawCandidate: build.mutation<void, number>({
            query(id) {
                return {
                    url: `candidates/${id}/withdraw`,
                    method: 'POST',
                    body: JSON.stringify({}),
                };
            },
            invalidatesTags: ['Candidates', 'Elections'],
        }),
        rejectCandidate: build.mutation<void, number>({
            query(id) {
                return {
                    url: `candidates/${id}/reject`,
                    method: 'POST',
                    body: JSON.stringify({}),
                };
            },
            invalidatesTags: ['Candidates', 'Elections'],
        }),
        markWinnerCandidate: build.mutation<void, number>({
            query(id) {
                return {
                    url: `candidates/${id}/mark-winner`,
                    method: 'POST',
                    body: JSON.stringify({}),
                };
            },
            invalidatesTags: ['Candidates', 'Elections'],
        }),
        unmarkWinnerCandidate: build.mutation<void, number>({
            query(id) {
                return {
                    url: `candidates/${id}/unmark-winner`,
                    method: 'POST',
                    body: JSON.stringify({}),
                };
            },
            invalidatesTags: ['Candidates', 'Elections'],
        }),
        saveWinnerResult: build.mutation<void, ResultType>({
            async queryFn(results, _queryApi, _extraOptions, baseQuery) {
                for (const result of results) {

                    if (result.candidateId && result.winner) {
                        const { error } = await baseQuery({
                            url: `candidates/${result.candidateId}/mark-winner`,
                            method: 'POST',
                            body: JSON.stringify({}),
                        });
                        if (error) {
                            return { error };
                        }
                    } else if (result.candidateId && !result.winner) {
                        const { error } = await baseQuery({
                            url: `candidates/${result.candidateId}/unmark-winner`,
                            method: 'POST',
                            body: JSON.stringify({}),
                        });
                        if (error) {
                            return { error };
                        }
                    }
                }
                return { data: undefined };
            },
            invalidatesTags: ['Candidates', 'Elections'],
        })
    }),
});

export const {
    useGetCandidatesQuery,
    useGetCandidateQuery,
    useAddCandidateMutation,
    useUpdateCandidateMutation,
    useGetUserCandidatesQuery,
    useGetPublicCandidatesQuery,
    useGetCandidatesUnvotedQuery,
    useGetCandidatesVotedQuery,
    useWithdrawCandidateMutation,
    useGetCandidatesForElectionQuery,
    useRejectCandidateMutation,
    useMarkWinnerCandidateMutation,
    useUnmarkWinnerCandidateMutation,
    useSaveWinnerResultMutation,
    useGetPublicResultCandidatesQuery
} = signInApi;