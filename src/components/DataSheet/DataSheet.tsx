import { FC, useEffect, useMemo, useState } from 'react'
import { Column, DataSheetGrid } from 'react-datasheet-grid'
import { Operation } from 'react-datasheet-grid/dist/types'
import { Box, Button, Stack, Tooltip, useTheme } from '@mui/material'
import './styles.css'

import { RefreshIcon } from '../Icons/RefreshIcon'
import { ContextMenu } from './ContextMenu'
import { AddRow } from './AddRow'
import { SaveIcon } from '../Icons/SaveIcon'

interface IRow {
	id: string
}

type Props = {
	rows: IRow[]
	onChange: (added: unknown[], updated: unknown[], deleted: unknown[]) => void
	columns: Partial<Column>[]
	lockRows?: boolean
	disableContextMenu?: boolean
	headerRowHeight?: number
	height?: number
}

export const DataSheet: FC<Props> = ({ rows, onChange, columns, ...props }) => {
	const { palette } = useTheme()
	const [data, setData] = useState<IRow[]>([])

	useEffect(() => {
		setData(rows)
	}, [rows])

	const createdRowIds = useMemo(() => new Set(), [])
	const updatedRowIds = useMemo(() => new Set(), [])
	const deletedRowIds = useMemo(() => new Set(), [])

	const genId = () => new Date().getTime().toString()

	const createHandler = () => ({ id: genId() })
	const duplicateHandler = ({ rowData }: { rowData: IRow }) => ({ ...rowData, id: genId() })

	const changeHandler = (value: IRow[], operations: Operation[]) => {
		const newValue = value as { id: string }[]

		for (const operation of operations) {
			if (operation.type === 'CREATE') {
				newValue.slice(operation.fromRowIndex, operation.toRowIndex).forEach(({ id }) => createdRowIds.add(id))
			}

			if (operation.type === 'UPDATE') {
				newValue.slice(operation.fromRowIndex, operation.toRowIndex).forEach(({ id }) => {
					if (!createdRowIds.has(id) && !deletedRowIds.has(id)) {
						updatedRowIds.add(id)
					}
				})
			}

			if (operation.type === 'DELETE') {
				let keptRows = 0

				data.slice(operation.fromRowIndex, operation.toRowIndex).forEach(({ id }, i) => {
					updatedRowIds.delete(id)

					if (createdRowIds.has(id)) {
						createdRowIds.delete(id)
					} else {
						deletedRowIds.add(id)
						newValue.splice(operation.fromRowIndex + keptRows++, 0, data[operation.fromRowIndex + i])
					}
				})
			}

			setData(newValue)
			// onChange(Array.from(createdRowIds), Array.from(updatedRowIds), Array.from(deletedRowIds))
		}
	}

	const addClasses = ({ rowData }: { rowData: unknown }) => {
		const row = rowData as { id: string }
		if (deletedRowIds.has(row.id)) {
			return 'row-deleted'
		}
		if (createdRowIds.has(row.id)) {
			return 'row-created'
		}
		if (updatedRowIds.has(row.id)) {
			return 'row-updated'
		}
	}

	const clearHandler = () => {
		createdRowIds.clear()
		updatedRowIds.clear()
		deletedRowIds.clear()
		setData(rows)
	}

	const saveHandler = () => {
		const created: unknown[] = []
		const updated: unknown[] = []
		const deleted: unknown[] = []

		data.forEach(row => {
			if (createdRowIds.has(row.id)) created.push(row)
			if (updatedRowIds.has(row.id)) updated.push(row)
			if (deletedRowIds.has(row.id)) deleted.push(row)
		})

		onChange(created, updated, deleted)
		createdRowIds.clear()
		updatedRowIds.clear()
		deletedRowIds.clear()
	}

	return (
		<Box position={'relative'}>
			<DataSheetGrid
				value={data}
				columns={columns}
				createRow={createHandler}
				duplicateRow={duplicateHandler}
				onChange={changeHandler}
				rowClassName={addClasses}
				// onChange={onChange}
				contextMenuComponent={props => <ContextMenu {...props} />}
				addRowsComponent={props => <AddRow {...props} />}
				autoAddRow
				height={props.height ? props.height : 1000}
				{...props}
			/>
			{props.lockRows && (
				<Box
					height={46}
					sx={{ background: '#fafafa', border: '1px solid var(--dsg-border-color);', borderTop: 'none' }}
				/>
			)}
			{createdRowIds.size > 0 || updatedRowIds.size > 0 || deletedRowIds.size > 0 ? (
				<Stack direction={'row'} spacing={1} sx={{ position: 'absolute', right: 8, bottom: 8 }}>
					<Tooltip title='Сохранить изменения'>
						<Button
							onClick={saveHandler}
							sx={{ minWidth: 48, ':hover': { svg: { fill: palette.primary.main } } }}
						>
							<SaveIcon fontSize={18} />
						</Button>
					</Tooltip>

					<Tooltip title='Отменить изменения'>
						<Button
							onClick={clearHandler}
							sx={{ minWidth: 48, ':hover': { svg: { fill: palette.secondary.main } } }}
						>
							<RefreshIcon fontSize={18} />
						</Button>
					</Tooltip>
				</Stack>
			) : null}
		</Box>
	)
}
