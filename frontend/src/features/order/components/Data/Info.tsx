import { FC } from 'react'
import { Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'

import type { IOrder } from '../../types/order'
import { DateFormat, DateTimeFormat } from '@/constants/date'
import { UrgentIcon } from '@/components/Icons/UrgentIcon'

type Props = {
	data: IOrder
}

export const Info: FC<Props> = ({ data }) => {
	return (
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
	)
}
