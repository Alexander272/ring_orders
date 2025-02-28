import { CSSProperties, FC } from 'react'

import type { IPosition } from '@/features/position/types/position'
import { PermRules } from '@/constants/permissions'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useCheckPermission } from '@/features/auth/hooks/check'
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

	const canAccept = useCheckPermission(PermRules.Accept.Write)

	const selectHandler = () => {
		if (data.isDeleted || (canAccept ? data.isAccepted : data.isDone)) return
		dispatch(setSelected(data))
	}

	let styles = {}
	if (canAccept ? data.isAccepted : data.isDone && data.isSent) {
		styles = { color: '#787878' }
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

	return (
		<TableRow
			onClick={selectHandler}
			hover
			sx={{
				...sx,
				...styles,
			}}
		>
			{Columns.map(c => {
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
