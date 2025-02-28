import { FC, useEffect, useState } from 'react'
import { Button, Stack } from '@mui/material'
import { Column, DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import type { IFetchError } from '@/app/types/error'
import type { ISent, ISentDTO } from '../../types/sent'
import { PermRules } from '@/constants/permissions'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { removeSpace } from '@/utils/format'
import { useCheckPermission } from '@/features/auth/hooks/check'
import { changeDialogIsOpen } from '@/features/dialog/dialogSlice'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { getSelected, setSelected } from '../../positionSlice'
import { useGetPositionsQuery } from '../../positionApiSlice'
import { useCreateSentMutation } from '../../sentApiSlice'

type Props = {
	orderId: string
}

export const SentForm: FC<Props> = ({ orderId }) => {
	const selected = useAppSelector(getSelected)
	const positions = Object.values(selected).sort((a, b) => (a.count < b.count ? -1 : 1))

	const canAccept = useCheckPermission(PermRules.Accept.Write)

	const { data, isFetching } = useGetPositionsQuery(
		{ orderId, sort: canAccept ? 'isAccepted' : 'isDone' },
		{ skip: !orderId }
	)

	const [rows, setRows] = useState<ISentDTO[]>([])
	const dispatch = useAppDispatch()

	const [create, { isLoading }] = useCreateSentMutation()

	useEffect(() => {
		let newRows = positions.map(p => ({
			positionId: p.id,
			count: p.count,
			name: p.name,
			remainder: p.made - p.sent,
			quantity: null,
		}))

		if (!positions.length && data) {
			newRows = data.data
				.filter(d => !d.isDeleted)
				.map(p => ({
					positionId: p.id,
					count: p.count,
					name: p.name,
					remainder: p.made - p.sent,
					quantity: null,
				}))
		}

		setRows(newRows)
	}, [])

	const columns: Column[] = [
		{ ...keyColumn<ISentDTO, 'count'>('count', intColumn), title: '№', width: 0.1, disabled: true },
		{ ...keyColumn<ISentDTO, 'name'>('name', textColumn), title: 'Наименование', disabled: true },
		{ ...keyColumn<ISentDTO, 'remainder'>('remainder', intColumn), title: 'Осталось', disabled: true, width: 0.5 },
		{
			...keyColumn<ISentDTO, 'quantity'>('quantity', intColumn),
			title: 'Отправлено',
			width: 0.5,
			prePasteValues: removeSpace,
		},
	]

	const cancelHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'Sent', isOpen: false }))
		dispatch(setSelected([]))
	}

	const saveHandler = async () => {
		try {
			const newRows = rows.filter(r => r.quantity && r.quantity > 0)
			if (!newRows.length) {
				cancelHandler()
				return
			}
			if (newRows.some(r => (r.remainder || 0) < (r.quantity || 0))) {
				toast.error('Количество которое было отправлено не может превышать остаток')
				return
			}

			const dto: ISent[] = newRows.map(r => ({
				id: r.positionId,
				positionId: r.positionId,
				date: dayjs().unix(),
				quantity: r.quantity || 0,
			}))

			await create(dto).unwrap()
			toast.success('Данные успешно сохранены')
			cancelHandler()
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	return (
		<Stack mt={-2}>
			{isLoading || isFetching ? <TopFallback /> : null}

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
