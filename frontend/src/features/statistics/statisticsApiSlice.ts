import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { IGetPositionStats, IPositionStats } from './types/stats'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const statisticsApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getPositionStatistics: builder.query<{ data: IPositionStats[]; total: number }, IGetPositionStats>({
			query: req => ({
				url: API.statistics.base,
				params: new URLSearchParams({ start: req.start || '', end: req.end || '' }),
			}),
			providesTags: [{ type: 'Statistics', id: 'Positions' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),
	}),
})

export const { useGetPositionStatisticsQuery } = statisticsApiSlice
