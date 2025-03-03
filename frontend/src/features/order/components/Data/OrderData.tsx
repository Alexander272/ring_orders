import { FC, useEffect } from 'react'
import { Stack, Typography } from '@mui/material'

import { PermRules } from '@/constants/permissions'
import { useAppDispatch } from '@/hooks/redux'
import { setSelected } from '@/features/position/positionSlice'
import { PositionTable } from '@/features/position/components/Table/PositionTable'
import { MadeDialog } from '@/features/position/components/Dialog/MadeDialog'
import { AcceptDialog } from '@/features/position/components/Dialog/AcceptDialog'
import { SentDialog } from '@/features/position/components/Dialog/SentDialog'
import { useGetPositionsQuery } from '@/features/position/positionApiSlice'
import { useGetOrderByIdQuery } from '@/features/order/orderApiSlice'
import { useCheckPermission } from '@/features/auth/hooks/check'
import { Fallback } from '@/components/Fallback/Fallback'
import { Header } from './Header'
import { Info } from './Info'
import { Buttons } from './Buttons'

type Props = {
	id: string
}

export const OrderData: FC<Props> = ({ id }) => {
	const canAccepted = useCheckPermission(PermRules.Accept.Write)

	const { data: order, isFetching } = useGetOrderByIdQuery(id, { skip: !id })
	const { data: positions } = useGetPositionsQuery(
		{ orderId: id, sort: canAccepted ? 'isAccepted' : 'isDone' },
		{ skip: !id }
	)
	const data = order?.data

	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(setSelected([]))
	}, [])

	const isDone = positions?.data.every(p => p.isDone || p.isDeleted)
	const isAccepted = positions?.data.every(p => p.isAccepted || p.isDeleted)
	const isSent = positions?.data.every(p => p.isSent || p.isDeleted)

	if (isFetching) return <Fallback />
	if (!data) return null
	return (
		<Stack mt={1} mb={2} spacing={2} position={'relative'}>
			<Header data={data} />

			<Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-end'} paddingX={1}>
				<Info data={data} />
				<Buttons data={data} isDone={isDone} isAccepted={isAccepted} isSent={isSent} />
			</Stack>

			<PositionTable orderId={id} />

			<MadeDialog />
			<AcceptDialog />
			<SentDialog />

			{data.notes && (
				<Stack paddingX={1}>
					<Typography fontWeight={'bold'}>Дополнительная информация</Typography>
					<Typography>{data.notes}</Typography>
				</Stack>
			)}
		</Stack>
	)
}
