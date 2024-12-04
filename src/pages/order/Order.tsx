import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'

import { PageBox } from '@/styled/PageBox'

export default function Order() {
	const { id } = useParams()

	return (
		<PageBox>
			<Box
				borderRadius={3}
				paddingX={2}
				paddingY={1}
				width={'60%'}
				margin={'0 auto'}
				border={'1px solid rgba(0, 0, 0, 0.12)'}
				height={'fit-content'}
				maxHeight={800}
				display={'flex'}
				flexDirection={'column'}
				overflow={'auto'}
				sx={{ backgroundColor: '#fff', userSelect: 'none' }}
			>
				OrderId {id}
			</Box>
		</PageBox>
	)
}
