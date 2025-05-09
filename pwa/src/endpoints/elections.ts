import { api } from './api';
import { Election, Hydra } from '../types';
import { BallotResult_jsonld_result_read_candidate_read, Election_jsonld_election_write, ElectionResultResource_jsonld_candidate_read } from './types';

export const signInApi = api.injectEndpoints({
    endpoints: (build) => ({
        getElections: build.query<Hydra<Election>, void>({
            query: () => `elections`,
            providesTags: ['Elections'],
        }),
        getPublicElections: build.query<Hydra<Election>, void>({
            query: () => `public/elections?perPage=3`,
            providesTags: ['PublicElections'],
        }),
        getPublicElectionsElectronic: build.query<Hydra<Election>, void>({
            query: () => `public/elections?stage=electronic_voting`,
            providesTags: ['PublicElections'],
        }),
        getElection: build.query<Election, number>({
            query: (id) => `elections/${id}`,
            providesTags: ['Elections'],
        }),
        addElection: build.mutation<Election, Election_jsonld_election_write>({
            query(body) {
                return {
                    url: `elections`,
                    method: 'POST',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Elections', 'PublicElections'],
        }),
        updateElection: build.mutation<Election, { id: number, body: Election_jsonld_election_write }>({
            query(data) {
                return {
                    url: `elections/${data.id}`,
                    method: 'PATCH',
                    body: JSON.stringify(data.body),
                };
            },
            invalidatesTags: ['Elections', 'PublicElections'],
        }),
        evaluateElection: build.mutation<void, number>({
            query(id) {
                return {
                    url: `elections/${id}/evaluate`,
                    method: 'POST',
                    body: JSON.stringify({}),
                };
            },
            invalidatesTags: ['Elections', 'PublicElections'],
        }),
        completeElection: build.mutation<void, number>({
            query(id) {
                return {
                    url: `elections/${id}/complete`,
                    method: 'POST',
                    body: JSON.stringify({}),
                };
            },
            invalidatesTags: ['Elections', 'PublicElections'],
        }),
        getElectionElectronicResult: build.query<ElectionResultResource_jsonld_candidate_read, number>({
            query: (id) => `elections/${id}/result`,
            providesTags: ['Elections', 'Votes'],
            transformResponse: (data: ElectionResultResource_jsonld_candidate_read) => {
                data.candidates?.sort((a, b) => {
                    return (a.candidate?.position.id ?? 0) - (b.candidate?.position.id ?? 0);
                })

                return data;
            }
        }),
    }),
});

export const {
    useGetElectionsQuery,
    useAddElectionMutation,
    useUpdateElectionMutation,
    useGetElectionQuery,
    useGetPublicElectionsQuery,
    useGetPublicElectionsElectronicQuery,
    useGetElectionElectronicResultQuery,
    useEvaluateElectionMutation,
    useCompleteElectionMutation,
} = signInApi;