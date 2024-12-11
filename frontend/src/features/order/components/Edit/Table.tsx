import { FC } from 'react'
import { Button } from '@mui/material'
import { Column, DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'

import type { IEditPositionDTO } from '@/features/position/types/position'
import { removeSpace } from '@/utils/format'
import { ContextMenu } from '@/components/DataSheet/ContextMenu'
import { TimesIcon } from '@/components/Icons/TimesIcon'

type Props = {
	rows: IEditPositionDTO[]
	onChange: (value: IEditPositionDTO[]) => void
}

const columns: Column<IEditPositionDTO>[] = [
	{ ...keyColumn<IEditPositionDTO, 'name'>('name', textColumn), title: 'Наименование', disabled: true },
	{ ...keyColumn<IEditPositionDTO, 'note'>('note', textColumn), title: 'Комментарий' },
	{
		...keyColumn<IEditPositionDTO, 'amount'>('amount', intColumn),
		title: 'Изготовить',
		prePasteValues: removeSpace,
	},
	{ ...keyColumn<IEditPositionDTO, 'made'>('made', intColumn), title: 'Выполнено', disabled: true },
	{ ...keyColumn<IEditPositionDTO, 'accepted'>('accepted', intColumn), title: 'Принято', disabled: true },
]

export const Table: FC<Props> = ({ rows, onChange }) => {
	const addClasses = ({ rowData }: { rowData: IEditPositionDTO }) => {
		if (rowData.isDeleted) return 'row-deleted'
	}

	return (
		<DataSheetGrid
			value={rows}
			onChange={onChange}
			columns={columns}
			height={500}
			lockRows
			rowClassName={addClasses}
			contextMenuComponent={props => <ContextMenu {...props} />}
			stickyRightColumn={{
				minWidth: 40,
				component: ({ rowData, setRowData }) => (
					<Button
						color='error'
						onClick={() => setRowData({ ...rowData, isDeleted: !rowData.isDeleted })}
						sx={{
							minWidth: 20,
							width: '100%',
							height: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<TimesIcon fontSize={14} fill={'#f44336'} />
					</Button>
				),
			}}
		/>
	)
}
