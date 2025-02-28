import { FC } from 'react'
import { Breadcrumbs, Button, Stack, Tooltip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import type { IOrder } from '../../types/order'
import { AppRoutes } from '@/constants/routes'
import { PermRules } from '@/constants/permissions'
import { useCheckPermission } from '@/features/auth/hooks/check'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { PenIcon } from '@/components/Icons/PenIcon'

type Props = {
	data: IOrder
}

export const Header: FC<Props> = ({ data }) => {
	const navigate = useNavigate()
	const canOrderWrite = useCheckPermission(PermRules.Orders.Write)

	const editHandler = () => {
		navigate(AppRoutes.EditOrder.replace(':id', data.id))
	}

	return (
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
	)
}
