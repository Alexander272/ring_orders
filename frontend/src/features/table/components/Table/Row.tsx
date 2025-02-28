import { CSSProperties, FC } from 'react'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import type { IOrder } from '@/features/order/types/order'
import { AppRoutes } from '@/constants/routes'
import { TableRow } from '@/components/Table/TableRow'
import { TableCell } from '@/components/Table/TableCell'
import { CellText } from '@/components/CellText/CellText'
import { Columns } from '../../constants/columns'

type Props = {
	data: IOrder
	sx?: CSSProperties
}

export const Row: FC<Props> = ({ data, sx }) => {
	const navigate = useNavigate()

	const selectHandler = () => {
		navigate(AppRoutes.Order.replace(':id', data.id))
	}

	const overdue = dayjs(data.dateOfDispatch * 1000)
		.endOf('day')
		.isBefore(dayjs())
	const nearest = dayjs(data.dateOfDispatch * 1000)
		.subtract(1, 'day')
		.startOf('day')
		.isBefore(dayjs())

	let background = ''
	if (data.urgent) background = '#ff8d005c'
	if (nearest) background = '#dbc60675'
	if (overdue) background = '#ff10106b'
	if (data.status == 'closed') background = '#e9e9e9ab'

	return (
		<TableRow onClick={selectHandler} hover sx={{ ...sx, background: background }}>
			{Columns.map(c => {
				let value = data[c.key as keyof IOrder]?.toString() || '-'
				if (c.formatter) value = c.formatter(data[c.key as keyof IOrder])

				if (c.styled) {
					return (
						<TableCell key={data.id + c.key} width={c.width}>
							<Typography sx={c.styled(data[c.key as keyof IOrder])} align='center'>
								{value}
							</Typography>
						</TableCell>
					)
				}

				return (
					<TableCell key={data.id + c.key} width={c.width}>
						<CellText value={value} />
					</TableCell>
				)
			})}
		</TableRow>
	)
}
