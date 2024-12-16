import { Hydra } from '../types';
import { api } from './api';
import { MediaResolution_jsonld_media_read } from './types';

export const resolutionApi = api.injectEndpoints({
    endpoints: (build) => ({
        getPublicResolution: build.query<MediaResolution_jsonld_media_read, number>({
            query: (id) => `public/media-resolutions/${id}`,
            providesTags: ['MediaResolutions'],
        }),
        getPublicResolutions: build.query<Hydra<MediaResolution_jsonld_media_read>, void>({
            query: () => `public/media-resolutions?itemsPerPage=100`,
            providesTags: ['MediaResolutions'],
        }),
        addResolution: build.mutation<MediaResolution_jsonld_media_read, { file: File, name: string, publishedAt: string }>({
            query: ({ file, name, publishedAt }) => {
                var bodyFormData = new FormData();
                bodyFormData.append('file', file);
                bodyFormData.append('name', name);
                bodyFormData.append('publishedAt', publishedAt);

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
        updateResolution: build.mutation<MediaResolution_jsonld_media_read, { id: number, body: { file: File, name: string, publishedAt: string } }>({
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