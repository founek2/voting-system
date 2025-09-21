import { api } from './api';
import { EmailResource_jsonld_write } from './types';

export const emailsApi = api.injectEndpoints({
    endpoints: (build) => ({
        sendSingleNotification: build.mutation<void, { electionId: number, emailAddress: string }>({
            query({ electionId, emailAddress }) {
                return {
                    url: `emails/elections/${electionId}/notify-single`,
                    method: 'POST',
                    body: JSON.stringify({ email: emailAddress } satisfies EmailResource_jsonld_write),
                };
            },
            invalidatesTags: ['SignIn'],
        }),
        sendAllNotification: build.mutation<void, number>({
            query(electionId) {
                return {
                    url: `emails/elections/${electionId}/notify-all`,
                    method: 'POST',
                    body: JSON.stringify({}),
                };
            },
            invalidatesTags: ['SignIn'],
        }),
    }),
});

export const {
    useSendAllNotificationMutation,
    useSendSingleNotificationMutation
} = emailsApi;