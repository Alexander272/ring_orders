import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { changeDialogIsOpen, getDialogState } from '@/features/dialog/dialogSlice'
import { Dialog } from '@/features/dialog/components/Dialog'
import { AcceptForm } from './AcceptForm'

export const AcceptDialog = () => {
	const modal = useAppSelector(getDialogState('Accept'))

	const dispatch = useAppDispatch()

	const closeHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'Accept', isOpen: false }))
	}

	return (
		<Dialog
			title={'Записать приемку'}
			body={<AcceptForm orderId={(modal?.content as string) || ''} />}
			open={modal?.isOpen || false}
			onClose={closeHandler}
			maxWidth='md'
			fullWidth
		/>
	)
}
