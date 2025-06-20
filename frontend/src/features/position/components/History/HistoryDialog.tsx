import { IconButton } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { changeDialogIsOpen, getDialogState } from '@/features/dialog/dialogSlice'
import { Dialog } from '@/features/dialog/components/Dialog'
import { TimesIcon } from '@/components/Icons/TimesIcon'
import { History } from './History'
import { useGetPositionByIdQuery } from '../../positionApiSlice'

type Context = {
	id: string
}

export const HistoryDialog = () => {
	const dialog = useAppSelector(getDialogState('History'))
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetPositionByIdQuery((dialog?.content as Context)?.id || '', {
		skip: !(dialog?.content as Context)?.id,
	})

	const closeHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'History', isOpen: false }))
	}

	return (
		<Dialog
			title={isFetching ? 'Загрузка...' : `История по позиции «${data?.data.name}»`}
			body={<History rowId={(dialog?.content as Context)?.id || ''} />}
			headerActions={
				<IconButton onClick={closeHandler} size='large' sx={{ mr: 2 }}>
					<TimesIcon fontSize={14} fill={'#6e6e6e'} />
				</IconButton>
			}
			open={dialog?.isOpen || false}
			onClose={closeHandler}
			maxWidth='md'
			fullWidth
		/>
	)
}
