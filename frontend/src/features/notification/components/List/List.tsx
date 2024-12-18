import { FC } from 'react'
import { Stack } from '@mui/material'

import { useGetNotificationsQuery } from '../../notificationApiSlice'
import { Item } from './Item'

export const List: FC = () => {
	const { data } = useGetNotificationsQuery(null)

	return (
		<Stack spacing={1} mt={1} mr={-1} pr={2} maxHeight={500} overflow={'auto'}>
			{data?.data.map((item, i) => (
				<Item key={item.id} data={item} isLast={i + 1 == data.total} />
			))}
		</Stack>
	)
}
