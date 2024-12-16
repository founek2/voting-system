import { Hydra } from '../types';
import { api } from './api';
import { MediaReport_jsonld_media_read } from './types';

export const reportApi = api.injectEndpoints({
    endpoints: (build) => ({
        getPublicReport: build.query<MediaReport_jsonld_media_read, number>({
            query: (id) => `public/media-reports/${id}`,
            providesTags: ['MediaReports'],
        }),
        getPublicReports: build.query<Hydra<MediaReport_jsonld_media_read>, void>({
            query: () => `public/media-reports?itemsPerPage=100`,
            providesTags: ['MediaReports'],
        }),
        addReport: build.mutation<MediaReport_jsonld_media_read, { file: File, name: string, publishedAt: string }>({
            query: ({ file, name, publishedAt }) => {
                var bodyFormData = new FormData();
                bodyFormData.append('file', file);
                bodyFormData.append('name', name);
                bodyFormData.append('publishedAt', publishedAt);

                return {
                    url: `media/reports`,
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined
                    },
                    body: bodyFormData,
                    formData: true
                }
            },
            invalidatesTags: ['MediaReports'],
        }),
        updateReport: build.mutation<MediaReport_jsonld_media_read, { id: number, body: { file: File, name: string, publishedAt: string } }>({
            query(data) {
                return {
                    url: `media/reports/${data.id}`,
                    method: 'PATCH',
                    body: JSON.stringify(data.body),
                };
            },
            invalidatesTags: ['MediaReports'],
        }),
        deleteReport: build.mutation<void, number>({
            query: (id) => {
                return {
                    url: `media/reports/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['MediaReports'],
        }),
    }),
});

export const { useGetPublicReportQuery, useGetPublicReportsQuery, useAddReportMutation, useDeleteReportMutation, useUpdateReportMutation } = reportApi;