import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { IAccept } from './types/accept'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const acceptApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getAccept: builder.query<{ data: IAccept[]; total: number }, string>({
			query: id => ({
				url: API.positions.accept,
				method: 'GET',
				params: new URLSearchParams({ position: id }),
			}),
			providesTags: [{ type: 'Accepted', id: 'ALL' }],
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

		createAccept: builder.mutation<null, IAccept[]>({
			query: data => ({
				url: API.positions.accept,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [
				{ type: 'Positions', id: 'ALL' },
				{ type: 'Accepted', id: 'ALL' },
			],
		}),
	}),
})

export const { useGetAcceptQuery, useCreateAcceptMutation } = acceptApiSlice
