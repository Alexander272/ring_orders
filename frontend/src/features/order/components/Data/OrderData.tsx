import { FC } from 'react'
import { Breadcrumbs, Button, Stack, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import type { IFetchError } from '@/app/types/error'
import { DateFormat, DateTimeFormat } from '@/constants/date'
import { AppRoutes } from '@/constants/routes'
import { PositionTable } from '@/features/position/components/Table/PositionTable'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { Fallback } from '@/components/Fallback/Fallback'
import { useGetOrderByIdQuery, useUpdateOrderMutation } from '../../orderApiSlice'

type Props = {
	id: string
}

export const OrderData: FC<Props> = ({ id }) => {
	const { data: order, isFetching } = useGetOrderByIdQuery(id, { skip: !id })
	const data = order?.data

	const [update] = useUpdateOrderMutation()

	const statusHandler = async () => {
		if (data?.status != 'new') return

		try {
			await update({ ...data, status: 'processing', dateOfAdoption: dayjs().unix() }).unwrap()
			toast.success('Заказ принят в работу')
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	if (isFetching) return <Fallback />
	if (!data) return null
	return (
		<Stack mt={1} mb={2} spacing={2}>
			<Stack>
				<Typography fontSize={'1.4rem'} pl={0.5}>
					Заказ №{data.count} ({data.orderNumber})
				</Typography>

				<Breadcrumbs aria-label='breadcrumb'>
					<Breadcrumb to={AppRoutes.Home}>Главная</Breadcrumb>
					<Breadcrumb to={AppRoutes.Order} active>
						Заказ №{data.count}
					</Breadcrumb>
				</Breadcrumbs>
			</Stack>

			{/* Order info */}
			<Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-end'} paddingX={1}>
				<Stack>
					<Typography>
						Заказ от{' '}
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
				</Stack>

				<Button
					onClick={statusHandler}
					variant='outlined'
					color={data.status == 'new' ? 'primary' : 'success'}
					disabled={data.status == 'closed'}
					sx={{ width: 200, padding: '6px 12px', textTransform: 'inherit' }}
				>
					{data.status == 'new' ? 'Принять' : 'Принят'} в работу
				</Button>
			</Stack>

			{/* Positions */}
			<PositionTable orderId={id} />

			{data.notes && (
				<Stack paddingX={1}>
					<Typography fontWeight={'bold'}>Дополнительная информация</Typography>
					<Typography>{data.notes}</Typography>
				</Stack>
			)}
		</Stack>
	)
}
