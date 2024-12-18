import { FC, useEffect } from 'react'
import { Breadcrumbs, Button, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import type { IFetchError } from '@/app/types/error'
import type { IEditOrderDTO } from '../../types/order'
import { DateFormat, DateTimeFormat } from '@/constants/date'
import { AppRoutes } from '@/constants/routes'
import { PermRules } from '@/constants/permissions'
import { useAppDispatch } from '@/hooks/redux'
import { setSelected } from '@/features/position/positionSlice'
import { PositionTable } from '@/features/position/components/Table/PositionTable'
import { MadeDialog } from '@/features/position/components/Dialog/MadeDialog'
import { AcceptDialog } from '@/features/position/components/Dialog/AcceptDialog'
import { useGetPositionsQuery } from '@/features/position/positionApiSlice'
import { changeDialogIsOpen } from '@/features/dialog/dialogSlice'
import { useCheckPermission } from '@/features/auth/hooks/check'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { Confirm } from '@/components/Confirm/Confirm'
import { Fallback } from '@/components/Fallback/Fallback'
import { PlusIcon } from '@/components/Icons/PlusIcon'
import { UrgentIcon } from '@/components/Icons/UrgentIcon'
import { PenIcon } from '@/components/Icons/PenIcon'
import { useGetOrderByIdQuery, useUpdateOrderMutation } from '../../orderApiSlice'

type Props = {
	id: string
}

export const OrderData: FC<Props> = ({ id }) => {
	const { palette } = useTheme()
	const navigate = useNavigate()

	const canOrderWrite = useCheckPermission(PermRules.Orders.Write)
	const canMade = useCheckPermission(PermRules.Made.Write)
	const canAccepted = useCheckPermission(PermRules.Accept.Write)

	const { data: order, isFetching } = useGetOrderByIdQuery(id, { skip: !id })
	const { data: positions } = useGetPositionsQuery(
		{ orderId: id, sort: canAccepted ? 'isAccepted' : 'isDone' },
		{ skip: !id }
	)
	const data = order?.data

	const dispatch = useAppDispatch()

	const [update, { isLoading }] = useUpdateOrderMutation()

	useEffect(() => {
		dispatch(setSelected([]))
	}, [])

	const isDone = positions?.data.every(p => p.isDone || p.isDeleted)
	const isAccepted = positions?.data.every(p => p.isAccepted || p.isDeleted)

	const editHandler = () => {
		navigate(AppRoutes.EditOrder.replace(':id', id))
	}

	const statusHandler = async () => {
		if (data?.status != 'new') return

		const newData: IEditOrderDTO = {
			...data,
			hasChanged: true,
			status: 'processing',
			dateOfAdoption: dayjs().unix(),
		}
		try {
			await update(newData).unwrap()
			toast.success('Заказ принят в работу')
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	const closeOrderHandler = async () => {
		if (!data) return

		const newData: IEditOrderDTO = { ...data, hasChanged: true, status: 'closed', closingDate: dayjs().unix() }
		try {
			await update(newData).unwrap()
			toast.success('Заказ закрыт')
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	const openHandler = () => {
		//TODO если доступно, и то, и другое, открываться будет только первая форма
		if (canMade) dispatch(changeDialogIsOpen({ variant: 'Made', isOpen: true, content: data?.id || '' }))
		if (canAccepted) dispatch(changeDialogIsOpen({ variant: 'Accept', isOpen: true, content: data?.id || '' }))
	}

	if (isFetching) return <Fallback />
	if (!data) return null
	return (
		<Stack mt={1} mb={2} spacing={2} position={'relative'}>
			<Stack>
				<Typography fontSize={'1.4rem'} pl={0.5} display={'flex'} alignItems={'center'}>
					Заказ №{data.count} ({data.orderNumber}){' '}
					{canOrderWrite && data.status != 'closed' ? (
						<Tooltip title={'Редактировать заказ'}>
							<Button onClick={editHandler} sx={{ ml: 1, minWidth: 48 }}>
								<PenIcon fontSize={18} />
							</Button>
						</Tooltip>
					) : null}
				</Typography>

				<Breadcrumbs aria-label='breadcrumb'>
					<Breadcrumb to={AppRoutes.Home}>Главная</Breadcrumb>
					<Breadcrumb to={AppRoutes.Order} active>
						Заказ №{data.count}
					</Breadcrumb>
				</Breadcrumbs>
			</Stack>

			{isLoading && <TopFallback />}

			{/* Order info */}
			<Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-end'} paddingX={1}>
				<Stack>
					<Typography>
						{data.urgent ? (
							<>
								<UrgentIcon fill={'#ff8c00f2'} mr={0.5} fontSize={18} />
								Срочный заказ{' '}
							</>
						) : (
							<>Заказ </>
						)}
						от{' '}
						<Typography fontWeight={'bold'} component={'span'}>
							{dayjs(data.dateOfIssue * 1000).format(DateFormat)}
						</Typography>{' '}
						- Изготовить до{' '}
						<Typography fontWeight={'bold'} component={'span'}>
							{dayjs(data.dateOfDispatch * 1000).format(DateFormat)}
						</Typography>
					</Typography>

					{data.dateOfAdoption > 0 ? (
						<Typography>
							Заказ принят в работу -{' '}
							<Typography fontWeight={'bold'} component={'span'}>
								{dayjs(data.dateOfAdoption * 1000).format(DateTimeFormat)}
							</Typography>
						</Typography>
					) : null}
					{data.closingDate > 0 ? (
						<Typography>
							Заказ закрыт -{' '}
							<Typography fontWeight={'bold'} component={'span'}>
								{dayjs(data.closingDate * 1000).format(DateTimeFormat)}
							</Typography>
						</Typography>
					) : null}
				</Stack>

				{!canOrderWrite && data.status == 'new' ? (
					<Button
						onClick={statusHandler}
						variant='outlined'
						disabled={isLoading}
						sx={{ width: 200, padding: '6px 12px', textTransform: 'inherit' }}
					>
						Принять в работу
					</Button>
				) : null}

				{data.status == 'processing' && ((canMade && !isDone) || (canAccepted && !isAccepted)) ? (
					<Button
						onClick={openHandler}
						variant='outlined'
						sx={{ width: 200, padding: '6px 12px', textTransform: 'inherit' }}
					>
						<PlusIcon fontSize={12} mr={1} fill={palette.primary.main} />
						Добавить
					</Button>
				) : null}
				{canOrderWrite && isAccepted && data.status != 'closed' ? (
					<Confirm
						confirmTitle='Закрытие заказа'
						iconColor='#ebcb31'
						buttonColor='primary'
						confirmText={'Вы действительно хотите закрыть заказ?'}
						onClick={closeOrderHandler}
						buttonComponent={
							<Button
								// onClick={closeOrderHandler}
								variant='outlined'
								sx={{ width: 200, padding: '6px 12px', textTransform: 'inherit' }}
							>
								Закрыть заказ
							</Button>
						}
					/>
				) : null}
			</Stack>

			{/* Positions */}
			<PositionTable orderId={id} />
			<MadeDialog />
			<AcceptDialog />

			{data.notes && (
				<Stack paddingX={1}>
					<Typography fontWeight={'bold'}>Дополнительная информация</Typography>
					<Typography>{data.notes}</Typography>
				</Stack>
			)}
		</Stack>
	)
}
