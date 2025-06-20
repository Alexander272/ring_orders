import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { ISent } from './types/sent'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const sentApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getSent: builder.query<{ data: ISent[]; total: number }, string>({
			query: id => ({
				url: API.positions.sent,
				method: 'GET',
				params: new URLSearchParams({ position: id }),
			}),
			providesTags: [{ type: 'Sent', id: 'ALL' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					console.log(error)
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),

		createSent: builder.mutation<null, ISent[]>({
			query: data => ({
				url: API.positions.sent,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [
				{ type: 'Positions', id: 'ALL' },
				{ type: 'Sent', id: 'ALL' },
			],
		}),
	}),
})

export const { useGetSentQuery, useCreateSentMutation } = sentApiSlice
