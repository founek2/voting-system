import { Hydra } from '../types';
import { api } from './api';
import { BoardMember_jsonld_member_public_read, BoardMember_jsonld_member_read, BoardMember_jsonld_member_write, HydraItemBaseSchema, Position_jsonld_position_read } from './types';

export const boardApi = api.injectEndpoints({
    endpoints: (build) => ({
        getPublicBoardMemebers: build.query<Hydra<BoardMember_jsonld_member_public_read & HydraItemBaseSchema>, void>({
            query: () => `public/board_members`,
            providesTags: ['BoardMembers'],
            transformResponse: (response: Hydra<BoardMember_jsonld_member_public_read & HydraItemBaseSchema>) => {
                response.member.sort((a, b) => {
                    if (a.appUser?.lastName && b.appUser?.lastName) {
                        return a.appUser?.lastName.localeCompare(b.appUser?.lastName)
                    }
                    return 0;
                });
                return response;
            },
        }),
        getBoardMember: build.query<BoardMember_jsonld_member_read, number>({
            query: (id) => `board_members/${id}`,
            providesTags: ['BoardMembers'],
        }),
        addBoardMember: build.mutation<Position_jsonld_position_read, BoardMember_jsonld_member_write>({
            query(body) {
                return {
                    url: `board_members`,
                    method: 'POST',
                    body: JSON.stringify(body),
                };
            },
            invalidatesTags: ['BoardMembers'],
        }),
        updateBoardMember: build.mutation<Position_jsonld_position_read, { id: number, body: BoardMember_jsonld_member_write }>({
            query(data) {
                return {
                    url: `board_members/${data.id}`,
                    method: 'PATCH',
                    body: JSON.stringify(data.body),
                };
            },
            invalidatesTags: ['BoardMembers'],
        }),
        deleteBoardMember: build.mutation<void, number>({
            query(id) {
                return {
                    url: `board_members/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['BoardMembers'],
        }),
    }),
});

export const {
    useGetPublicBoardMemebersQuery,
    useGetBoardMemberQuery,
    useAddBoardMemberMutation,
    useUpdateBoardMemberMutation,
    useDeleteBoardMemberMutation
} = boardApi;
