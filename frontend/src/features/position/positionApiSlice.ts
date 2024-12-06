import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { IPosition } from './types/position'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const positionApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getPositions: builder.query<{ data: IPosition[]; total: number }, string>({
			query: order => ({
				url: API.positions.base,
				method: 'GET',
				params: { order },
			}),
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					console.log(error)
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
			providesTags: [{ type: 'Positions', id: 'ALL' }],
		}),
	}),
})

export const { useGetPositionsQuery } = positionApiSlice
