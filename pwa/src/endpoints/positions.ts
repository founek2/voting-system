import { Hydra } from '../types';
import { api } from './api';
import { Position_jsonld_position_read, Position_position_write } from './types';

export const signInApi = api.injectEndpoints({
    endpoints: (build) => ({
        getPositions: build.query<Hydra<Position_jsonld_position_read>, void>({
            query: () => `positions`,
            providesTags: ['Positions'],
        }),
        getPosition: build.query<Position_jsonld_position_read, number>({
            query: (id) => `positions/${id}`,
            providesTags: ['Positions'],
        }),
        addPosition: build.mutation<Position_jsonld_position_read, Position_position_write>({
            query(body) {
                return {
                    url: `positions`,
                    method: 'POST',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['Positions'],
        }),
        updatePosition: build.mutation<Position_jsonld_position_read, { id: number, body: Position_position_write }>({
            query(data) {
                return {
                    url: `positions/${data.id}`,
                    method: 'PATCH',
                    body: JSON.stringify(data.body),
                };
            },
            invalidatesTags: ['Positions'],
        }),
    }),
});

export const { useGetPositionsQuery, useUpdatePositionMutation, useAddPositionMutation, useGetPositionQuery } = signInApi;