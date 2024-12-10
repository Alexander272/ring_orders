import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { IMade } from './types/made'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const madeApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getMade: builder.query<{ data: IMade[]; total: number }, string>({
			query: id => ({
				url: `${API.positions.made}/${id}`,
				method: 'GET',
			}),
			providesTags: [{ type: 'Made', id: 'ALL' }],
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

		createMade: builder.mutation<null, IMade[]>({
			query: data => ({
				url: API.positions.made,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [
				{ type: 'Positions', id: 'ALL' },
				{ type: 'Made', id: 'ALL' },
			],
		}),
	}),
})

export const { useGetMadeQuery, useCreateMadeMutation } = madeApiSlice
