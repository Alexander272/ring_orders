import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { changeDialogIsOpen, getDialogState } from '@/features/dialog/dialogSlice'
import { Dialog } from '@/features/dialog/components/Dialog'
import { SentForm } from './SentForm'

export const SentDialog = () => {
	const modal = useAppSelector(getDialogState('Sent'))

	const dispatch = useAppDispatch()

	const closeHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'Sent', isOpen: false }))
	}

	return (
		<Dialog
			title={'Записать изготовление'}
			body={<SentForm orderId={(modal?.content as { id: string })?.id || ''} />}
			open={modal?.isOpen || false}
			onClose={closeHandler}
			maxWidth='md'
			fullWidth
		/>
	)
}
