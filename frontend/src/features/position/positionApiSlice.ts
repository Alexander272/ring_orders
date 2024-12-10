import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { IGetPosition, IPosition } from './types/position'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const positionApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getPositions: builder.query<{ data: IPosition[]; total: number }, IGetPosition>({
			query: data => ({
				url: API.positions.base,
				method: 'GET',
				params: { order: data.orderId, sort: data.sort },
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

		updatePositions: builder.mutation<null, IPosition[]>({
			query: data => ({
				url: API.positions.several,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'Positions', id: 'ALL' }],
		}),
	}),
})

export const { useGetPositionsQuery, useUpdatePositionsMutation } = positionApiSlice
