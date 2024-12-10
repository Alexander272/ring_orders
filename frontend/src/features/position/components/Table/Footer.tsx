import { FC } from 'react'
import { Stack, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getSelected } from '../../positionSlice'

type Props = {
	total: number
}

export const Footer: FC<Props> = ({ total }) => {
	const selected = useAppSelector(getSelected)
	// const dispatch = useAppDispatch()

	// const clickHandler = () => {
	// 	dispatch(changeDialogIsOpen({ variant: 'Made', isOpen: true }))
	// }

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
			{/* <Stack>
				{selectedCount > 0 ? (
					
				) : null}
			</Stack> */}

			<Typography>
				Строк выбрано:{' '}
				<Typography component={'span'} fontWeight={'bold'}>
					{selectedCount}
				</Typography>
			</Typography>

			<Typography>
				Всего наименований:{' '}
				<Typography component={'span'} fontWeight={'bold'}>
					{total}
				</Typography>
			</Typography>

			{/* <Button onClick={clickHandler} disabled={selectedCount === 0} sx={{ textTransform: 'inherit', width: 180 }}>
				Изготовлено
			</Button> */}
		</Stack>
	)
}
