import { Button, Stack, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { AppRoutes } from '@/constants/routes'
import { PermRules } from '@/constants/permissions'
import { useGetImportantQuery } from '@/features/order/orderApiSlice'
import { useCheckPermission } from '@/features/auth/hooks/check'
import { Fallback } from '@/components/Fallback/Fallback'
import { PlusIcon } from '@/components/Icons/PlusIcon'
import { UrgentIcon } from '@/components/Icons/UrgentIcon'
import { OverdueIcon } from '@/components/Icons/OverdueIcon'
import { ClockIcon } from '@/components/Icons/ClockIcon'
import { Filters } from './Filters/Filters'

export const Header = () => {
	const { palette } = useTheme()
	const navigate = useNavigate()

	const { data, isFetching } = useGetImportantQuery(null)
	const { urgent, overdue, nearest } = data?.data || { urgent: 0, overdue: 0, nearest: 0 }

	const createHandler = () => {
		navigate(AppRoutes.NewOrder)
	}

	return (
		<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} mt={1} mb={0.5} mx={2}>
			<Stack direction={'row'} spacing={2}>
				{useCheckPermission(PermRules.Orders.Write) ? (
					<Button onClick={createHandler} variant='outlined'>
						<PlusIcon fontSize={12} mr={1} fill={palette.primary.main} /> Добавить
					</Button>
				) : null}

				{isFetching ? <Fallback /> : null}

				{urgent ? (
					<Stack
						onClick={() => toast.error('Не реализовано')}
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
						onClick={() => toast.error('Не реализовано')}
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
						onClick={() => toast.error('Не реализовано')}
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
