import { FC } from 'react'
import { Button, Stack, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { changeDialogIsOpen } from '@/features/dialog/dialogSlice'
import { getSelected } from '../../positionSlice'

type Props = {
	total: number
}

export const Footer: FC<Props> = ({ total }) => {
	const selected = useAppSelector(getSelected)
	const dispatch = useAppDispatch()

	const clickHandler = () => {
		dispatch(changeDialogIsOpen({ variant: 'Made', isOpen: true }))
	}

	const selectedCount = Object.keys(selected).length

	return (
		<Stack
			direction={'row'}
			alignItems={'center'}
			paddingX={1}
			mr={'10px'}
			mt={1}
			justifyContent={'space-between'}
			// sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}
		>
			<Stack>
				<Typography>
					Всего наименований:{' '}
					<Typography component={'span'} fontWeight={'bold'}>
						{total}
					</Typography>
				</Typography>

				{selectedCount > 0 ? (
					<Typography>
						Строк выбрано:{' '}
						<Typography component={'span'} fontWeight={'bold'}>
							{selectedCount}
						</Typography>
					</Typography>
				) : null}
			</Stack>

			<Button onClick={clickHandler} disabled={selectedCount === 0} sx={{ textTransform: 'inherit', width: 180 }}>
				Изготовлено
			</Button>
		</Stack>
	)
}
