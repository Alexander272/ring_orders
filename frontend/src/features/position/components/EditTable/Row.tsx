import { CSSProperties, FC } from 'react'
import { Button } from '@mui/material'

import type { IPosition } from '@/features/position/types/position'
import { TableRow } from '@/components/Table/TableRow'
import { TableCell } from '@/components/Table/TableCell'
import { CellText } from '@/components/CellText/CellText'
import { Confirm } from '@/components/Confirm/Confirm'
import { CloseIcon } from '@/components/Icons/CloseIcon'
import { EditColumns } from '../../constants/columns'

type Props = {
	data: IPosition
	onDelete: (id: string) => void
	sx?: CSSProperties
}

export const Row: FC<Props> = ({ data, onDelete, sx }) => {
	const deleteHandler = () => onDelete(data.id)

	let styles = {}
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

	return (
		<TableRow
			sx={{
				...sx,
				...styles,
			}}
		>
			{EditColumns.map(c => {
				let value = data[c.key as keyof IPosition]?.toString() || '-'
				if (c.formatter) value = c.formatter(data[c.key as keyof IPosition])

				if (c.key == 'actions')
					return (
						<TableCell key={data.id + c.key} width={c.width}>
							<Confirm
								onClick={deleteHandler}
								confirmText='Вы уверены, что хотите удалить позицию?'
								disabled={data.isDeleted}
								buttonComponent={
									<Button disabled={data.isDeleted}>
										<CloseIcon fontSize={20} fill={data.isDeleted ? '#9b9b9b' : '#d8453e'} />
									</Button>
								}
							/>
						</TableCell>
					)

				return (
					<TableCell key={data.id + c.key} width={c.width}>
						<CellText value={value} />
					</TableCell>
				)
			})}
		</TableRow>
	)
}
