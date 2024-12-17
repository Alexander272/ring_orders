import { toast } from 'react-toastify'

import type { IBaseFetchError } from '@/app/types/error'
import type { IParams } from '@/app/types/params'
import type { IEditOrderDTO, IImportantOrders, IOrder, IOrderDTO } from './types/order'
import { apiSlice } from '@/app/apiSlice'
import { API } from '@/app/api'
import { buildSiUrlParams } from './utils/buildUrlParams'

export const orderApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getOrders: builder.query<{ data: IOrder[]; total: number }, IParams>({
			query: params => ({
				url: API.orders.base,
				method: 'GET',
				params: buildSiUrlParams(params),
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
			providesTags: [{ type: 'Orders', id: 'ALL' }],
		}),

		getOrderById: builder.query<{ data: IOrder }, string>({
			query: id => ({
				url: `${API.orders.base}/${id}`,
				method: 'GET',
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
			providesTags: (_arg, _error, id) => [{ type: 'Orders', id: id }],
		}),

		getNumbers: builder.query<{ data: string[] }, { number: string; limit?: number }>({
			query: data => ({
				url: API.orders.numbers,
				method: 'GET',
				params: { number: data.number, limit: data.limit || 0 },
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
			providesTags: [{ type: 'Orders', id: 'Numbers' }],
		}),

		getImportant: builder.query<{ data: IImportantOrders }, null>({
			query: () => ({
				url: API.orders.important,
				method: 'GET',
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
			providesTags: [{ type: 'Orders', id: 'Important' }],
		}),

		createOrder: builder.mutation<null, IOrderDTO>({
			query: data => ({
				url: API.orders.base,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: [
				{ type: 'Orders', id: 'ALL' },
				{ type: 'Orders', id: 'Important' },
				{ type: 'Orders', id: 'Numbers' },
			],
		}),

		updateOrder: builder.mutation<null, IEditOrderDTO>({
			query: data => ({
				url: `${API.orders.base}/${data.id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (_arg, _error, data) => [
				{ type: 'Orders', id: 'ALL' },
				{ type: 'Orders', id: 'Important' },
				{ type: 'Orders', id: data.id },
				{ type: 'Positions', id: 'ALL' },
			],
		}),

		deleteOrder: builder.mutation<null, string>({
			query: id => ({
				url: `${API.orders.base}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [
				{ type: 'Orders', id: 'ALL' },
				{ type: 'Orders', id: 'Important' },
				{ type: 'Orders', id: 'Numbers' },
			],
		}),
	}),
})

export const {
	useGetOrdersQuery,
	useGetOrderByIdQuery,
	useGetNumbersQuery,
	useGetImportantQuery,
	useCreateOrderMutation,
	useUpdateOrderMutation,
	useDeleteOrderMutation,
} = orderApiSlice
