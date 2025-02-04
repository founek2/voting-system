import { Hydra } from '../types';
import { api } from './api';
import { MediaPoster_jsonld_media_object_read, Position_jsonld_position_read, Position_position_write } from './types';

export const mediaPosterApi = api.injectEndpoints({
    endpoints: (build) => ({
        getPoster: build.query<MediaPoster_jsonld_media_object_read, number>({
            query: (id) => `media/posters/${id}`,
            providesTags: ['MediaPosters'],
        }),
        addPoster: build.mutation<MediaPoster_jsonld_media_object_read, { file: File }>({
            query: ({ file }) => {
                var bodyFormData = new FormData();
                bodyFormData.append('file', file);

                return {
                    url: `media/posters`,
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined
                    },
                    body: bodyFormData,
                    formData: true
                }
            },
            invalidatesTags: ['MediaPosters'],
        }),
        deletePoster: build.mutation<void, number>({
            query: (id) => {
                return {
                    url: `media/posters/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['MediaPosters'],
        }),
    }),
});

export const { useGetPosterQuery, useAddPosterMutation, useDeletePosterMutation } = mediaPosterApi;