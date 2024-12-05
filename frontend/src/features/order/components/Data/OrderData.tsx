import { FC } from 'react'
import { Breadcrumbs, Button, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'

import { DateFormat } from '@/constants/date'
import { AppRoutes } from '@/constants/routes'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { IOrder } from '../../types/order'
import { PositionTable } from '@/features/position/components/Table/PositionTable'

type Props = {
	id: string
}

export const OrderData: FC<Props> = ({ id }) => {
	const data: IOrder = {
		id,
		count: 1,
		orderNumber: '11534',
		dateOfIssue: 1732734000,
		dateOfDispatch: 1734030000,
		closingDate: 0,
		urgent: false,
		status: 'processing',
		notes: 'comment',
		positions: [
			{
				id: '1',
				count: 1,
				name: '32x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 0,
				accepted: 0,
			},
			{
				id: '2',
				count: 2,
				name: '34x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 120,
				done: 40,
				accepted: 20,
			},
			{
				id: '3',
				count: 3,
				name: '38x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 160,
				done: 0,
				accepted: 0,
				isDeleted: true,
			},
			{
				id: '4',
				count: 4,
				name: '42x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 100,
				accepted: 80,
				isDone: true,
			},
		],
	}

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

				<Button
					variant='outlined'
					color={data.status == 'new' ? 'primary' : 'success'}
					sx={{ width: 200, padding: '6px 12px', textTransform: 'inherit' }}
				>
					{data.status == 'new' ? 'Принять' : 'Принят'} в работу
				</Button>
			</Stack>

			{/* Positions */}
			<PositionTable orderId={id} />
			{/* <Table>
				<TableHead>
					<TableRow height={34}>
						<TableCell width={50}>№</TableCell>
						<TableCell width={250}>Наименование</TableCell>
						<TableCell width={275}>Комментарий</TableCell>
						<TableCell width={170}>Изготовить</TableCell>
						<TableCell width={170}>Выполнено</TableCell>
						<TableCell width={170}>Принято</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.positions.map(p => (
						<TableRow key={p.id} height={34} hover>
							<TableCell width={300}>
								<CellText value={p.name} />
							</TableCell>
							<TableCell width={275}>
								<CellText value={p.comment} />
							</TableCell>
							<TableCell width={170}>
								<CellText value={numberFormat(p.amount)} />
							</TableCell>
							<TableCell width={170}>
								<CellText value={numberFormat(p.done)} />
							</TableCell>
							<TableCell width={170}>
								<CellText value={numberFormat(p.accepted)} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table> */}

			{data.notes && (
				<Stack paddingX={1}>
					<Typography fontWeight={'bold'}>Дополнительная информация</Typography>
					<Typography>{data.notes}</Typography>
				</Stack>
			)}
		</Stack>
	)
}
