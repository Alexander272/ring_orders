import { AppBar, Stack, Toolbar } from '@mui/material'

import logo from '@/assets/logo.webp'

import { AppRoutes } from '@/constants/routes'
import { useAppSelector } from '@/hooks/redux'
import { useSignOutMutation } from '@/features/auth/authApiSlice'
import { getToken } from '@/features/user/userSlice'
import { Notification } from '@/features/notification/components/Notification/Notification'
import { ImageLink, NavButton } from './header.style'

export const LayoutHeader = () => {
	const [signOut] = useSignOutMutation()

	const token = useAppSelector(getToken)

	const signOutHandler = () => {
		signOut(null)
	}

	return (
		<AppBar sx={{ borderRadius: 0 }}>
			<Toolbar
				sx={{
					justifyContent: 'space-between',
					alignItems: 'inherit',
				}}
			>
				<ImageLink to={AppRoutes.Home}>
					<img height={46} width={157} src={logo} alt='logo' />
				</ImageLink>
				{token && (
					<Stack direction={'row'} spacing={3} minHeight={'100%'}>
						<Notification />

						{/* <NavLink to='/'>Главная</NavLink> */}

						{/* {CheckPermission({ section: 'criterions', method: 'WRITE' }) && (
						<NavLink to={'criterions'}>Критерии</NavLink>
					)} */}

						<NavButton onClick={signOutHandler}>Выйти</NavButton>
					</Stack>
				)}
			</Toolbar>
		</AppBar>
	)
}
