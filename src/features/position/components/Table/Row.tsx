import { CSSProperties, FC } from 'react'

import type { IPosition } from '@/features/position/types/position'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { TableRow } from '@/components/Table/TableRow'
import { TableCell } from '@/components/Table/TableCell'
import { CellText } from '@/components/CellText/CellText'
import { Columns } from '../../constants/columns'
import { getSelected, setSelected } from '../../positionSlice'

type Props = {
	data: IPosition
	sx?: CSSProperties
}

export const Row: FC<Props> = ({ data, sx }) => {
	const selected = useAppSelector(getSelected)
	const dispatch = useAppDispatch()

	const selectHandler = () => {
		if (data.isDeleted || data.isDone) return
		dispatch(setSelected(data))
	}

	// const contextHandler = (event: MouseEvent<HTMLDivElement>) => {
	// 	event.preventDefault()
	// 	const menu = {
	// 		active: data.id,
	// 		coords: { mouseX: event.clientX + 2, mouseY: event.clientY - 6 },
	// 	}
	// 	dispatch(setContextMenu(menu))
	// }

	let styles = {}
	if (data.isDone) {
		styles = {
			// backgroundColor: '#ebebeba1',
			color: '#545454',
		}
	}
	if (data.isDeleted) {
		styles = {
			color: '#00000082',
			'&:after': {
				content: '""',
				position: 'absolute',
				width: '100%',
				height: '1px',
				background: '#ff1818',
				top: '50%',
				transform: 'translateY(-50%)',
			},
		}
	}
	if (selected[data.id]) {
		styles = { background: '#dde6fd' }
	}

	// let background = ''
	// if (data.isDone) background = '#e5e5e5a1'
	// if (selected[data.id]) background = '#dde6fd'
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
				// backgroundColor: background,
				...styles,
			}}
		>
			{Columns.map(c => {
				// if (hidden[c.key]) return null

				let value = data[c.key as keyof IPosition]?.toString() || '-'
				if (c.formatter) value = c.formatter(data[c.key as keyof IPosition])

				return (
					<TableCell key={data.id + c.key} width={c.width}>
						<CellText value={value} />
					</TableCell>
				)
			})}
		</TableRow>
	)
}
