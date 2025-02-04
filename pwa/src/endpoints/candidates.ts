import { Candidate, Hydra } from '../types';
import { api } from './api';
import { Candidate_candidate_edit, Candidate_candidate_write, Position_jsonld_position_read, Position_position_write } from './types';

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
        getCandidatesVoted: build.query<Hydra<Candidate>, number>({
            query: (electionId) => `elections/${electionId}/candidates?type=voted`,
            providesTags: ['Candidates', 'Votes'],
        }),
        getCandidatesUnvoted: build.query<Hydra<Candidate>, number>({
            query: (electionId) => `elections/${electionId}/candidates?type=unvoted`,
            providesTags: ['Candidates', 'Votes'],
        }),
        addCandidate: build.mutation<Candidate, { userId: number, body: Candidate_candidate_write }>({
            query({ userId, body }) {
                return {
                    url: `candidates`,
                    method: 'POST',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Candidates'],
        }),
        updateCandidate: build.mutation<Position_jsonld_position_read, { id: number, body: Candidate_candidate_edit }>({
            query({ id, body }) {
                return {
                    url: `candidates/${id}`,
                    method: 'PATCH',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Candidates'],
        }),
        withdrawCandidate: build.mutation<void, number>({
            query(id) {
                return {
                    url: `candidates/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Candidates'],
        }),
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
    useWithdrawCandidateMutation
} = signInApi;