import { api } from './api';
import { Election, Hydra } from '../types';
import { Election_jsonld_election_read, Election_jsonld_election_write } from './types';

export const signInApi = api.injectEndpoints({
    endpoints: (build) => ({
        getElections: build.query<Hydra<Election_jsonld_election_read>, void>({
            query: () => `elections`,
            providesTags: ['Elections'],
        }),
        getPublicElections: build.query<Hydra<Election_jsonld_election_read>, void>({
            query: () => `public/elections?perPage=3`,
            providesTags: ['PublicElections'],
        }),
        getElection: build.query<Election_jsonld_election_read, number>({
            query: (id) => `elections/${id}`,
            providesTags: ['Elections'],
        }),
        addElection: build.mutation<Election_jsonld_election_read, Election_jsonld_election_write>({
            query(body) {
                return {
                    url: `elections`,
                    method: 'POST',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Elections', 'PublicElections'],
        }),
        updateElection: build.mutation<Election_jsonld_election_read, { id: number, body: Election_jsonld_election_write }>({
            query(data) {
                return {
                    url: `elections/${data.id}`,
                    // headers: {
                    //     'Content-Type': 'application/merge-patch+json'
                    // },
                    method: 'PATCH',
                    body: JSON.stringify(data.body),
                };
            },
            invalidatesTags: ['Elections', 'PublicElections'],
        }),
    }),
});

export const { useGetElectionsQuery, useAddElectionMutation, useUpdateElectionMutation, useGetElectionQuery, useGetPublicElectionsQuery } = signInApi;