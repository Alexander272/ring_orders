import { FC, useEffect, useState } from 'react'
import { Button, Stack } from '@mui/material'
import { Column, DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import type { IFetchError } from '@/app/types/error'
import type { IAccept, IAcceptDTO } from '../../types/accept'
import type { IReject } from '../../types/reject'
import { PermRules } from '@/constants/permissions'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { removeSpace } from '@/utils/format'
import { changeDialogIsOpen } from '@/features/dialog/dialogSlice'
import { useCheckPermission } from '@/features/auth/hooks/check'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { getSelected, setSelected } from '../../positionSlice'
import { useGetPositionsQuery } from '../../positionApiSlice'
import { useCreateAcceptMutation } from '../../acceptApiSlice'
import { useCreateRejectMutation } from '../../rejectApiSlice'

type Props = {
	orderId: string
}

export const AcceptForm: FC<Props> = ({ orderId }) => {
	const selected = useAppSelector(getSelected)
	const positions = Object.values(selected).sort((a, b) => (a.count < b.count ? -1 : 1))

	const canAccept = useCheckPermission(PermRules.Accept.Write)

	const { data, isFetching } = useGetPositionsQuery(
		{ orderId, sort: canAccept ? 'isAccepted' : 'isDone' },
		{ skip: !orderId },
	)

	const [rows, setRows] = useState<IAcceptDTO[]>([])

	const [createAccept, { isLoading: isAcceptLoading }] = useCreateAcceptMutation()
	const [createReject, { isLoading: isRejectLoading }] = useCreateRejectMutation()

	const dispatch = useAppDispatch()

	const isLoading = isAcceptLoading || isRejectLoading

	useEffect(() => {
		let newRows = positions.map(p => ({
			positionId: p.id,
			count: p.count,
			name: p.name,
			remainder: Math.min(p.sent, p.amount) - p.accepted - p.rejected,
			amount: null,
			rejectAmount: null,
			rejectNote: '',
		}))

		if (!positions.length && data) {
			newRows = data.data
				.filter(d => !d.isAccepted && !d.isDeleted)
				.map(p => ({
					positionId: p.id,
					count: p.count,
					name: p.name,
					remainder: Math.min(p.sent, p.amount) - p.accepted - p.rejected,
					amount: null,
					rejectAmount: null,
					rejectNote: '',
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
			width: 0.4,
		},
		{
			...keyColumn<IAcceptDTO, 'amount'>('amount', intColumn),
			title: 'Принято',
			width: 0.4,
			prePasteValues: removeSpace,
		},
		{
			...keyColumn<IAcceptDTO, 'rejectAmount'>('rejectAmount', intColumn),
			title: 'Брак',
			width: 0.4,
			prePasteValues: removeSpace,
		},
		{
			...keyColumn<IAcceptDTO, 'rejectNote'>('rejectNote', textColumn),
			title: 'Примечание',
		},
	]

	const cancelHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'Accept', isOpen: false }))
		dispatch(setSelected([]))
	}

	const saveHandler = async () => {
		try {
			const acceptRows = rows.filter(r => r.amount && r.amount > 0)
			const rejectRows = rows.filter(r => r.rejectAmount && r.rejectAmount > 0)

			if (!acceptRows.length && !rejectRows.length) {
				cancelHandler()
				return
			}
			if (rows.some(r => (r.remainder || 0) < (r.amount || 0) + (r.rejectAmount || 0))) {
				toast.error('Сумма принятого и брака не может превышать остаток')
				return
			}

			if (acceptRows.length) {
				const acceptDTO: IAccept[] = acceptRows.map(r => ({
					id: r.positionId,
					positionId: r.positionId,
					date: dayjs().unix(),
					amount: r.amount || 0,
				}))
				await createAccept(acceptDTO).unwrap()
			}

			if (rejectRows.length) {
				const rejectDTO: IReject[] = rejectRows.map(r => ({
					id: r.positionId,
					positionId: r.positionId,
					date: dayjs().unix(),
					amount: r.rejectAmount || 0,
					note: r.rejectNote || '',
				}))
				await createReject(rejectDTO).unwrap()
			}

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
