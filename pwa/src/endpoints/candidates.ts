import { Candidate, Hydra } from '../types';
import { api } from './api';
import { Candidate_candidate_edit, Candidate_candidate_write, Position_jsonld_position_read, Position_position_write } from './types';

export const signInApi = api.injectEndpoints({
    endpoints: (build) => ({
        getCandidates: build.query<Hydra<Candidate>, void>({
            query: () => `candidates`,
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
        addCandidate: build.mutation<Candidate, { userId: number, body: Candidate_candidate_write }>({
            query({ userId, body }) {
                return {
                    url: `users/${userId}/candidates`,
                    method: 'POST',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Candidates'],
        }),
        updateCandidate: build.mutation<Position_jsonld_position_read, { userId: number, id: number, body: Candidate_candidate_edit }>({
            query({ userId, id, body }) {
                return {
                    url: `users/${userId}/candidates/${id}`,
                    method: 'PATCH',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Candidates'],
        }),
    }),
});

export const { useGetCandidatesQuery, useGetCandidateQuery, useAddCandidateMutation, useUpdateCandidateMutation, useGetUserCandidatesQuery } = signInApi;