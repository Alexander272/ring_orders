import { Suspense } from 'react'
import { AppBar, Stack, Toolbar, Tooltip, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'

import logo from '@/assets/logo.webp'

import { AppRoutes } from '@/constants/routes'
import { PermRules } from '@/constants/permissions'
import { useAppSelector } from '@/hooks/redux'
import { useCheckPermission } from '@/features/auth/hooks/check'
import { useSignOutMutation } from '@/features/auth/authApiSlice'
import { getToken } from '@/features/user/userSlice'
import { Notification } from '@/features/notification/components/Notification/NotificationLazy'
import { BarIcon } from '../Icons/BarIcon'
import { ImageLink, NavButton } from './header.style'

export const LayoutHeader = () => {
	const { palette } = useTheme()

	const [signOut] = useSignOutMutation()

	const token = useAppSelector(getToken)

	const hasStats = useCheckPermission(PermRules.Statistics.Read)

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
						<Suspense>
							<Notification />
						</Suspense>

						{hasStats ? (
							<Link to={AppRoutes.Statistics} aria-label='statistic page'>
								<Tooltip title='Статистика' disableInteractive>
									<NavButton>
										<BarIcon
											sx={{
												fontSize: 26,
												transition: '0.3s all ease-in-out',
												stroke: palette.primary.main,
											}}
										/>
									</NavButton>
								</Tooltip>
							</Link>
						) : null}

						<NavButton onClick={signOutHandler}>Выйти</NavButton>
					</Stack>
				)}
			</Toolbar>
		</AppBar>
	)
}
