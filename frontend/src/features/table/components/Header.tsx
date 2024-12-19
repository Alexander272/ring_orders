import { Button, Stack, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import type { IFilter } from '@/app/types/params'
import { AppRoutes } from '@/constants/routes'
import { PermRules } from '@/constants/permissions'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useGetImportantQuery } from '@/features/order/orderApiSlice'
import { useCheckPermission } from '@/features/auth/hooks/check'
import { PlusIcon } from '@/components/Icons/PlusIcon'
import { UrgentIcon } from '@/components/Icons/UrgentIcon'
import { OverdueIcon } from '@/components/Icons/OverdueIcon'
import { ClockIcon } from '@/components/Icons/ClockIcon'
import { Filters } from './Filters/Filters'
import { getFilters, setFilters } from '../tableSlice'

const status: IFilter = {
	field: 'status',
	fieldType: 'list',
	compareType: 'in',
	value: 'new|processing',
}

export const Header = () => {
	const { palette } = useTheme()
	const navigate = useNavigate()

	const filters = useAppSelector(getFilters)
	const dispatch = useAppDispatch()

	const { data } = useGetImportantQuery(null)
	const { urgent, overdue, nearest } = data?.data || { urgent: 0, overdue: 0, nearest: 0 }

	const createHandler = () => {
		navigate(AppRoutes.NewOrder)
	}

	const showUrgent = () => {
		const data: IFilter = {
			field: 'urgent',
			fieldType: 'switch',
			compareType: 'eq',
			value: 'true',
		}

		if (filters[0]?.field == 'urgent') dispatch(setFilters([]))
		else dispatch(setFilters([data, status]))
	}
	const showOverdue = () => {
		const data: IFilter = {
			field: 'dateOfDispatch',
			fieldType: 'date',
			compareType: 'lte',
			value: dayjs().startOf('day').unix().toString(),
		}

		if (filters[0]?.field == 'dateOfDispatch') dispatch(setFilters([]))
		else dispatch(setFilters([data, status]))
	}
	const showNearest = () => {
		const data: IFilter = {
			field: 'dateOfDispatch',
			fieldType: 'date',
			compareType: 'lte',
			value: dayjs().add(2, 'day').startOf('day').unix().toString(),
		}

		if (filters[0]?.field == 'dateOfDispatch') dispatch(setFilters([]))
		else dispatch(setFilters([data, status]))
	}

	return (
		<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} mt={1} mb={0.5} mx={2}>
			<Stack direction={'row'} spacing={2}>
				{useCheckPermission(PermRules.Orders.Write) ? (
					<Button onClick={createHandler} variant='outlined'>
						<PlusIcon fontSize={12} mr={1} fill={palette.primary.main} /> Добавить
					</Button>
				) : null}

				{urgent ? (
					<Stack
						onClick={showUrgent}
						direction={'row'}
						alignItems={'center'}
						padding={'4px 10px'}
						sx={{ borderRadius: 3, border: '1px solid #ff8c00f2', cursor: 'pointer' }}
					>
						<UrgentIcon fill={'#ff8c00f2'} />
						<Typography mt={0.3}>{`${urgent} ${urgent == 1 ? 'Срочный' : 'Срочных'}`}</Typography>
					</Stack>
				) : null}

				{overdue ? (
					<Stack
						onClick={showOverdue}
						direction={'row'}
						alignItems={'center'}
						padding={'4px 10px'}
						sx={{ borderRadius: 3, border: '1px solid #d8453e', cursor: 'pointer' }}
					>
						<OverdueIcon mr={0.5} />
						<Typography mt={0.3}>
							{`${overdue} ${overdue == 1 ? 'Просроченный' : 'Просроченных'}`}
						</Typography>
					</Stack>
				) : null}

				{nearest ? (
					<Stack
						onClick={showNearest}
						direction={'row'}
						alignItems={'center'}
						padding={'4px 10px'}
						sx={{ borderRadius: 3, border: '1px solid #d5c531', cursor: 'pointer' }}
					>
						<ClockIcon mr={0.7} fill={'#d5c531'} />
						<Typography mt={0.3}>{`${nearest} ${nearest == 1 ? 'Ближайший' : 'Ближайших'}`}</Typography>
					</Stack>
				) : null}
			</Stack>
			<Stack direction={'row'} alignItems={'center'} spacing={2}>
				{/* <Setting /> */}
				<Filters />
			</Stack>
		</Stack>
	)
}
