import { Hydra } from '../types';
import { api } from './api';
import { MediaResolution_jsonld_resolution_object_read } from './types';

export const resolutionApi = api.injectEndpoints({
    endpoints: (build) => ({
        getPublicResolution: build.query<MediaResolution_jsonld_resolution_object_read, number>({
            query: (id) => `public/media-resolutions/${id}`,
            providesTags: ['MediaResolutions'],
        }),
        getPublicResolutions: build.query<Hydra<MediaResolution_jsonld_resolution_object_read>, void>({
            query: () => `public/media-resolutions?itemsPerPage=100`,
            providesTags: ['MediaResolutions'],
        }),
        addResolution: build.mutation<MediaResolution_jsonld_resolution_object_read, { file: File, name: string }>({
            query: ({ file, name }) => {
                var bodyFormData = new FormData();
                bodyFormData.append('file', file);
                bodyFormData.append('name', name);

                return {
                    url: `media/resolutions`,
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined
                    },
                    body: bodyFormData,
                    formData: true
                }
            },
            invalidatesTags: ['MediaResolutions'],
        }),
        updateResolution: build.mutation<MediaResolution_jsonld_resolution_object_read, { id: number, body: { file: File, name: string } }>({
            query(data) {
                return {
                    url: `media/resolutions/${data.id}`,
                    method: 'PATCH',
                    body: JSON.stringify(data.body),
                };
            },
            invalidatesTags: ['MediaResolutions'],
        }),
        deleteResolution: build.mutation<void, number>({
            query: (id) => {
                return {
                    url: `media/resolutions/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['MediaResolutions'],
        }),
    }),
});

export const { useGetPublicResolutionQuery, useGetPublicResolutionsQuery, useAddResolutionMutation, useDeleteResolutionMutation, useUpdateResolutionMutation } = resolutionApi;