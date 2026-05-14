import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { IReject } from './types/reject'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const rejectApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getReject: builder.query<{ data: IReject[]; total: number }, string>({
			query: id => ({
				url: API.positions.reject,
				method: 'GET',
				params: new URLSearchParams({ position: id }),
			}),
			providesTags: [{ type: 'Reject', id: 'ALL' }],
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

		createReject: builder.mutation<null, IReject[]>({
			query: data => ({
				url: API.positions.reject,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [
				{ type: 'Positions', id: 'ALL' },
				{ type: 'Reject', id: 'ALL' },
			],
		}),
	}),
})

export const { useGetRejectQuery, useCreateRejectMutation } = rejectApiSlice
