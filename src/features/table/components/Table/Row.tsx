import { CSSProperties, FC } from 'react'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import type { IOrder } from '@/features/order/types/order'
import { TableRow } from '@/components/Table/TableRow'
import { TableCell } from '@/components/Table/TableCell'
import { CellText } from '@/components/CellText/CellText'
import { Columns } from '../../constants/columns'
import { AppRoutes } from '@/constants/routes'
// import { setContextMenu } from '../../tableSlice'

type Props = {
	data: IOrder
	sx?: CSSProperties
}

export const Row: FC<Props> = ({ data, sx }) => {
	const navigate = useNavigate()
	// const dispatch = useAppDispatch()

	// const { palette } = useTheme()

	// const selectHandler = () => {
	// 	dispatch(setSelected(data.id))
	// }

	// const contextHandler = (event: MouseEvent<HTMLDivElement>) => {
	// 	event.preventDefault()
	// 	const menu = {
	// 		active: data.id,
	// 		coords: { mouseX: event.clientX + 2, mouseY: event.clientY - 6 },
	// 	}
	// 	dispatch(setContextMenu(menu))
	// }

	const selectHandler = () => {
		navigate(AppRoutes.Order.replace(':id', data.id))
	}

	let background = ''
	if (data.urgent) background = '#ff8d005c'
	// let background = data.itemStyle?.background
	// if (selected[data.id]) background = palette.rowActive.light
	// if (contextMenu?.active == data.id) background = palette.rowActive.main

	return (
		<TableRow
			onClick={selectHandler}
			// onContext={contextHandler}
			hover
			sx={{
				...sx,
				// padding: '0 6px',
				background: background,
			}}
		>
			{Columns.map(c => {
				// if (hidden[c.key]) return null

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
