import { api } from './api';
import { Election, Election_jsonld } from './types';

export const signInApi = api.injectEndpoints({
    endpoints: (build) => ({
        getElections: build.query<Election_jsonld, void>({
            query: () => `elections`,
            providesTags: ['Elections'],
        }),
        getElection: build.query<Election_jsonld, number>({
            query: (id) => `elections/${id}`,
            providesTags: ['Elections'],
        }),
        addElection: build.mutation<Election_jsonld, Election>({
            query(body) {
                return {
                    url: `elections`,
                    method: 'POST',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Elections'],
        }),
        updateElection: build.mutation<Election_jsonld, Election>({
            query(body) {
                return {
                    url: `elections/${body.id}`,
                    method: 'PATCH',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Elections'],
        }),
    }),
});

export const { useGetElectionsQuery, useAddElectionMutation, useUpdateElectionMutation, useGetElectionQuery } = signInApi;