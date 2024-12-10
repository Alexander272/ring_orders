import { Box } from '@mui/material'
import { Fallback } from './Fallback'

export const TopFallback = () => {
	return (
		<Box
			position={'absolute'}
			width={'100%'}
			height={'100%'}
			zIndex={15}
			display={'flex'}
			alignItems={'center'}
			justifyContent={'center'}
		>
			<Fallback height={160} width={160} borderRadius={3} backgroundColor={'#fafafa'} />
		</Box>
	)
}
