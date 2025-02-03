import { FC } from 'react'
import { IconButton, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import type { IFetchError } from '@/app/types/error'
import type { INotification } from '../../types/notification'
import { Fallback } from '@/components/Fallback/Fallback'
import { TimesIcon } from '@/components/Icons/TimesIcon'
import { useDeleteNotificationMutation } from '../../notificationApiSlice'
import { WarningIcon } from '@/components/Icons/WarningIcon'

type Props = {
	data: INotification
	isLast?: boolean
}

export const Item: FC<Props> = ({ data, isLast }) => {
	const [remove, { isLoading }] = useDeleteNotificationMutation()

	const deleteHandler = async () => {
		try {
			await remove(data.id).unwrap()
			toast.success('Уведомление удалено')
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	return (
		<Stack sx={{ pb: 1, borderBottom: isLast ? 'none' : '1px solid #e0e0e0' }}>
			{isLoading && <Fallback position={'absolute'} top={0} left={0} />}

			{/* //TODO помечать приоритет уведомления */}
			<Stack spacing={2} direction={'row'} justifyContent={'space-between'}>
				<Typography variant='body2'>{dayjs(data.date * 1000).fromNow()}</Typography>

				<IconButton onClick={deleteHandler}>
					<TimesIcon fontSize={12} />
				</IconButton>
			</Stack>
			<Link to={data.link} style={{ textDecoration: 'none' }}>
				<Typography
					color={data.priority == 0 ? 'error' : 'textPrimary'}
					fontWeight={'bold'}
					sx={{
						display: 'flex',
						alignItems: 'center',
						transition: 'all 0.3s ease-in-out',
						':hover': { color: 'primary.main' },
					}}
				>
					{data.priority < 3 && (
						<WarningIcon fill={data.priority == 2 ? '#9c9c09' : '#d71818'} fontSize={20} mr={1} />
					)}
					{data.title}
				</Typography>
			</Link>
			<Typography>{data.text}</Typography>
		</Stack>
	)
}
