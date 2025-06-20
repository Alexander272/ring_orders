import { useAppDispatch, useAppSelector } from '@/hooks/redux'

import { ListItemIcon, Menu, MenuItem } from '@mui/material'
import { HistoryIcon } from '@/components/Icons/HistoryIcon'
import { getContextMenu, setContextMenu } from '../../positionSlice'
import { changeDialogIsOpen } from '@/features/dialog/dialogSlice'

export const ContextMenu = () => {
	const contextMenu = useAppSelector(getContextMenu)
	const dispatch = useAppDispatch()

	const closeHandler = () => {
		dispatch(setContextMenu())
	}

	const openFormHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'History', isOpen: true, content: { id: contextMenu?.active || '' } }))
		closeHandler()
	}

	return (
		<Menu
			open={Boolean(contextMenu)}
			onClose={closeHandler}
			anchorReference='anchorPosition'
			anchorPosition={
				contextMenu ? { top: contextMenu.coords.mouseY, left: contextMenu.coords.mouseX } : undefined
			}
		>
			<MenuItem onClick={openFormHandler}>
				<ListItemIcon>
					<HistoryIcon fontSize={20} fill={'#363636'} />
				</ListItemIcon>
				История
			</MenuItem>
		</Menu>
	)
}
