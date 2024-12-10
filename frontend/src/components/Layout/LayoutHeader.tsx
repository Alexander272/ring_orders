import { AppBar, Box, MenuItem, Select, SelectChangeEvent, Stack, Toolbar } from '@mui/material'

// import { useAppSelector } from '@/hooks/redux'
import { useSignOutMutation } from '@/features/auth/authApiSlice'
// import { getToken } from '@/features/user/userSlice'
import { NavButton } from './header.style'
import logo from '@/assets/logo.webp'

import { useAppDispatch } from '@/hooks/redux'
import { useEffect, useState } from 'react'
import { setUser } from '@/features/user/userSlice'

export const LayoutHeader = () => {
	const [signOut] = useSignOutMutation()

	// const token = useAppSelector(getToken)

	const dispatch = useAppDispatch()
	const [role, setRole] = useState('user')

	const user = {
		role: 'user',
		id: 'test',
		name: 'user',
		menu: ['orders:read', 'made:read', 'made:write', 'accepted:read'],
		token: '12343',
	}
	useEffect(() => {
		dispatch(setUser(user))
	}, [dispatch])

	const changeRoleHandler = (event: SelectChangeEvent) => {
		setRole(event.target.value)
		if (event.target.value === 'user') {
			user.menu = ['orders:read', 'made:read', 'made:write', 'accept:read']
			dispatch(setUser(user))
		}
		if (event.target.value === 'editor') {
			user.menu = ['orders:read', 'orders:write', 'made:read', 'accepted:read', 'accept:write']
			dispatch(setUser(user))
		}
	}

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
				<Box alignSelf={'center'} display={'flex'} alignItems={'center'}>
					<img height={46} width={157} src={logo} alt='logo' />
				</Box>
				{/* {token && ( */}
				<Stack direction={'row'} spacing={3} minHeight={'100%'}>
					{/* <NavLink to='/'>Главная</NavLink> */}

					{/* {CheckPermission({ section: 'criterions', method: 'WRITE' }) && (
						<NavLink to={'criterions'}>Критерии</NavLink>
					)} */}
					<Select value={role} onChange={changeRoleHandler}>
						<MenuItem value={'user'}>Пользователь</MenuItem>
						<MenuItem value={'editor'}>Редактор</MenuItem>
					</Select>

					<NavButton onClick={signOutHandler}>Выйти</NavButton>
				</Stack>
				{/* )} */}
			</Toolbar>
		</AppBar>
	)
}
