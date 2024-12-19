import { Button, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

import type { IFetchError } from '@/app/types/error'
import { Badge } from '@/components/Badge/Badge'
import { Popover } from '@/components/Popover/Popover'
import { Fallback } from '@/components/Fallback/Fallback'
import { BellOutlineIcon } from '@/components/Icons/BellOutlineIcon'
import { TimesIcon } from '@/components/Icons/TimesIcon'
import { useDeleteNotificationMutation, useGetNotificationsQuery } from '../../notificationApiSlice'
import { List } from '../List/List'

export const Notification = () => {
	const { palette } = useTheme()
	const [open, setOpen] = useState(false)
	const anchor = useRef(null)

	const { data } = useGetNotificationsQuery(null, { pollingInterval: 5 * 60000, skipPollingIfUnfocused: true })
	const [remove, { isLoading }] = useDeleteNotificationMutation()

	const toggleHandler = () => setOpen(prev => !prev)

	const deleteHandler = async () => {
		try {
			await remove(null).unwrap()
			toast.success('Уведомления удалены')
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	return (
		<Stack
			justifyContent={'center'}
			alignItems={'center'}
			position={'relative'}
			sx={{
				':hover': { ':after': { maxWidth: '100%' } },
				':after': {
					content: '""',
					position: 'absolute',
					bottom: 0,
					height: 2,
					width: '100%',
					maxWidth: open ? '100%' : '0%',
					backgroundColor: palette.primary.main,
					transition: 'all 0.3s ease-in-out',
				},
			}}
		>
			<IconButton onClick={toggleHandler} sx={{ width: 48, height: 48 }} ref={anchor}>
				<Badge color='primary' badgeContent={data?.total} invisible={!data || data?.total == 0}>
					<BellOutlineIcon fontSize={20} />
				</Badge>
			</IconButton>

			<Popover open={open} onClose={toggleHandler} anchorEl={anchor.current} positionLeft='71%'>
				{isLoading && <Fallback position={'absolute'} top={0} left={0} />}

				{data?.total ? (
					<>
						{/* //TODO сделать фильтр по приоритету */}
						<List />
						<Stack mr={2} pt={0.5} borderTop={'1px solid #e0e0e0'}>
							<Button onClick={deleteHandler} color='inherit' sx={{ textTransform: 'inherit' }}>
								<TimesIcon fontSize={12} mr={1} />
								Удалить все
							</Button>
						</Stack>
					</>
				) : (
					<Stack alignItems={'center'} mt={3} mb={3}>
						<BellOutlineIcon fontSize={40} fill={palette.text.secondary} mb={1} />

						<Typography color='textSecondary' textAlign={'center'} sx={{ fontSize: 18 }}>
							Уведомлений нет
						</Typography>
					</Stack>
				)}
			</Popover>
		</Stack>
	)
}

export default Notification
