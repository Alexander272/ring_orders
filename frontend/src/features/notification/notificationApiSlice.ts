import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { INotification } from './types/notification'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const notificationApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getNotifications: builder.query<{ data: INotification[]; total: number }, null>({
			query: () => API.notifications.base,
			providesTags: [{ type: 'Notifications', id: 'ALL' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		deleteNotification: builder.mutation<null, string | null>({
			query: id => ({
				url: API.notifications.base,
				params: { id },
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Notifications', id: 'ALL' }],
		}),
	}),
})

export const { useGetNotificationsQuery, useDeleteNotificationMutation } = notificationApiSlice
