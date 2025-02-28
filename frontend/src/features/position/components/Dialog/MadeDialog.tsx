import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { changeDialogIsOpen, getDialogState } from '@/features/dialog/dialogSlice'
import { Dialog } from '@/features/dialog/components/Dialog'
import { MadeForm } from './MadeForm'

export const MadeDialog = () => {
	const modal = useAppSelector(getDialogState('Made'))

	const dispatch = useAppDispatch()

	const closeHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'Made', isOpen: false }))
	}

	const content = modal?.content as { id: string; isDefect?: boolean }

	return (
		<Dialog
			title={'Записать изготовление'}
			body={<MadeForm orderId={content?.id || ''} isDefected={content?.isDefect || false} />}
			open={modal?.isOpen || false}
			onClose={closeHandler}
			maxWidth='md'
			fullWidth
		/>
	)
}
