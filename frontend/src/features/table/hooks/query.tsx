import { useAppSelector } from '@/hooks/redux'
import { getFilters, getTablePage, getTableSize, getTableSort } from '../tableSlice'
import { useGetOrdersQuery } from '@/features/order/orderApiSlice'

export const useGetAllData = () => {
	const page = useAppSelector(getTablePage)
	const size = useAppSelector(getTableSize)

	const sort = useAppSelector(getTableSort)
	const filters = useAppSelector(getFilters)

	const query = useGetOrdersQuery(
		{ page, size, sort, filters },
		{ pollingInterval: 5 * 60000, skipPollingIfUnfocused: true, refetchOnFocus: true }
	)

	return query
}
