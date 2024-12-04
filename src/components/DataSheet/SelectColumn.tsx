import { memo, useLayoutEffect, useRef } from 'react'
import { MenuItem, Select } from '@mui/material'
import { CellProps } from 'react-datasheet-grid'

import { SelectOptions } from './generic'

export const SelectComponent = memo(
	({ rowData, setRowData, focus, stopEditing, columnData }: CellProps<string | null, SelectOptions>) => {
		const ref = useRef<HTMLSelectElement>(null)

		useLayoutEffect(() => {
			if (focus) {
				ref.current?.focus()
			} else {
				ref.current?.blur()
			}
		}, [focus])

		return (
			<Select
				ref={ref}
				disabled={columnData.disabled}
				value={columnData.choices.find(({ value }) => value === rowData)?.value ?? ''}
				// menuPortalTarget={document.body}
				open={focus}
				onChange={choice => {
					if (choice === null) return

					setRowData((choice.target.value as string) || '')
					setTimeout(stopEditing, 0)
				}}
				onClose={() => stopEditing({ nextRow: false })}
				// options={columnData.choices}
				MenuProps={{ slotProps: { paper: { sx: { mt: 0.5, borderRadius: 1 } } } }}
				fullWidth
				sx={{ fieldset: { border: 'none' } }}
			>
				{columnData.choices.map(choice => (
					<MenuItem key={choice.value} value={choice.value}>
						{choice.label}
					</MenuItem>
				))}
			</Select>
		)
	}
)
