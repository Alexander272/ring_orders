import { Button, Stack, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { AppRoutes } from '@/constants/routes'
import { PlusIcon } from '@/components/Icons/PlusIcon'
import { Filters } from './Filters/Filters'
import { UrgentIcon } from '@/components/Icons/UrgentIcon'
import { OverdueIcon } from '@/components/Icons/OverdueIcon'

export const Header = () => {
	const { palette } = useTheme()
	const navigate = useNavigate()

	const createHandler = () => {
		navigate(AppRoutes.NewOrder)
	}

	return (
		<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} mt={1} mb={0.5} mx={2}>
			<Stack direction={'row'} spacing={2}>
				<Button onClick={createHandler} variant='outlined'>
					<PlusIcon fontSize={12} mr={1} fill={palette.primary.main} /> Добавить
				</Button>

				<Stack
					direction={'row'}
					alignItems={'center'}
					padding={'4px 10px'}
					sx={{ borderRadius: 3, border: '1px solid #ff8c00f2', cursor: 'pointer' }}
				>
					<UrgentIcon fill={'#ff8c00f2'} />
					<Typography mt={0.3}>{`1 ${1 == 1 ? 'Срочный' : 'Срочных'}`}</Typography>
				</Stack>
				<Stack
					direction={'row'}
					alignItems={'center'}
					padding={'4px 10px'}
					sx={{ borderRadius: 3, border: '1px solid #d8453e', cursor: 'pointer' }}
				>
					<OverdueIcon mr={0.5} />
					<Typography mt={0.3}>{`1 ${1 == 1 ? 'Просроченный' : 'Просроченных'}`}</Typography>
				</Stack>
				{/* //TODO кол-во срочных заказов, кол-во просроченных заказов, кол-во заказов которые нужно закрыть в ближайшие пару дней */}
			</Stack>
			<Stack direction={'row'} alignItems={'center'} spacing={2}>
				{/* <Setting /> */}
				<Filters />
				{/* //TODO */}

				{/* <Button onClick={createHandler} variant='outlined'>
					<PlusIcon fontSize={12} mr={1} fill={palette.primary.main} /> Добавить
				</Button> */}
				{/* <Create /> */}
			</Stack>
		</Stack>
	)
}
