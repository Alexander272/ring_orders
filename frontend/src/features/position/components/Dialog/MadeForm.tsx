import { useState } from 'react'
import { Column, DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { Button, Stack } from '@mui/material'

import type { IMadeDTO } from '../../types/made'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { removeSpace } from '@/utils/format'
import { getSelected } from '../../positionSlice'
import { changeDialogIsOpen } from '@/features/dialog/dialogSlice'

export const MadeForm = () => {
	const selected = useAppSelector(getSelected)
	const positions = Object.values(selected).sort((a, b) => (a.count < b.count ? -1 : 1))
	const [rows, setRows] = useState<IMadeDTO[]>(
		positions.map(p => ({
			positionId: p.id,
			count: p.count,
			name: p.name,
			remainder: p.amount - p.done,
			amount: null,
		}))
	)
	// const positions = Object.values(selected).sort((a, b) => (a.count > b.count ? -1 : 1))

	const dispatch = useAppDispatch()

	const columns: Column[] = [
		{ ...keyColumn<IMadeDTO, 'count'>('count', intColumn), title: '№', width: 0.1, disabled: true },
		{ ...keyColumn<IMadeDTO, 'name'>('name', textColumn), title: 'Наименование', disabled: true },
		{ ...keyColumn<IMadeDTO, 'remainder'>('remainder', intColumn), title: 'Осталось', disabled: true, width: 0.5 },
		{
			...keyColumn<IMadeDTO, 'amount'>('amount', intColumn),
			title: 'Изготовлено',
			width: 0.5,
			prePasteValues: removeSpace,
		},
	]

	const cancelHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'Made', isOpen: false }))
	}

	const saveHandler = () => {}

	return (
		<Stack mt={-2}>
			<DataSheetGrid value={rows} onChange={setRows} columns={columns} lockRows />

			<Stack direction={'row'} mt={2} justifyContent={'center'} spacing={2}>
				<Button onClick={cancelHandler} variant='outlined' color='inherit' sx={{ width: 280 }}>
					Отмена
				</Button>
				<Button onClick={saveHandler} variant='outlined' sx={{ width: 280 }}>
					Сохранить
				</Button>
			</Stack>
		</Stack>
	)
}
