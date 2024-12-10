import { FC, useEffect, useState } from 'react'
import { Button, Stack } from '@mui/material'
import { Column, DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import type { IFetchError } from '@/app/types/error'
import type { IAccept, IAcceptDTO } from '../../types/accept'
import { PermRules } from '@/constants/permissions'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { removeSpace } from '@/utils/format'
import { changeDialogIsOpen } from '@/features/dialog/dialogSlice'
import { useCheckPermission } from '@/features/auth/hooks/check'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { getSelected } from '../../positionSlice'
import { useGetPositionsQuery } from '../../positionApiSlice'
import { useCreateAcceptMutation } from '../../acceptApiSlice'

type Props = {
	orderId: string
}

export const AcceptForm: FC<Props> = ({ orderId }) => {
	const selected = useAppSelector(getSelected)
	const positions = Object.values(selected).sort((a, b) => (a.count < b.count ? -1 : 1))

	const canAccept = useCheckPermission(PermRules.Accept.Write)

	const { data, isFetching } = useGetPositionsQuery(
		{ orderId, sort: canAccept ? 'isAccepted' : 'isDone' },
		{ skip: !orderId }
	)

	const [rows, setRows] = useState<IAcceptDTO[]>([])

	const [create, { isLoading }] = useCreateAcceptMutation()

	const dispatch = useAppDispatch()

	useEffect(() => {
		let newRows = positions.map(p => ({
			positionId: p.id,
			count: p.count,
			name: p.name,
			remainder: p.made - p.accepted,
			amount: null,
		}))

		if (!positions.length && data) {
			newRows = data.data
				.filter(d => !d.isAccepted && !d.isDeleted)
				.map(p => ({
					positionId: p.id,
					count: p.count,
					name: p.name,
					remainder: p.made - p.accepted,
					amount: null,
				}))
		}

		setRows(newRows)
	}, [])

	const columns: Column[] = [
		{ ...keyColumn<IAcceptDTO, 'count'>('count', intColumn), title: '№', width: 0.1, disabled: true },
		{ ...keyColumn<IAcceptDTO, 'name'>('name', textColumn), title: 'Наименование', disabled: true },
		{
			...keyColumn<IAcceptDTO, 'remainder'>('remainder', intColumn),
			title: 'Осталось',
			disabled: true,
			width: 0.5,
		},
		{
			...keyColumn<IAcceptDTO, 'amount'>('amount', intColumn),
			title: 'Принято',
			width: 0.5,
			prePasteValues: removeSpace,
		},
	]

	const cancelHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'Accept', isOpen: false }))
	}

	const saveHandler = async () => {
		try {
			const newRows = rows.filter(r => r.amount)
			if (newRows.some(r => (r.remainder || 0) < (r.amount || 0))) {
				toast.error('Количество которое было принято не может превышать остаток')
				return
			}

			const dto: IAccept[] = newRows.map(r => ({
				id: r.positionId,
				positionId: r.positionId,
				date: dayjs().unix(),
				amount: r.amount || 0,
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
