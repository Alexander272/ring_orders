import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'

import { PageBox } from '@/styled/PageBox'
import { Edit } from '@/features/order/components/Edit/Edit'

export default function EditOrder() {
	const { id } = useParams()

	return (
		<PageBox>
			<Box
				borderRadius={3}
				paddingX={2}
				paddingY={1}
				width={1320}
				margin={'0 auto'}
				border={'1px solid rgba(0, 0, 0, 0.12)'}
				height={'fit-content'}
				minHeight={450}
				maxHeight={800}
				display={'flex'}
				flexDirection={'column'}
				overflow={'auto'}
				sx={{ backgroundColor: '#fff' }}
			>
				{id ? <Edit id={id} /> : null}
			</Box>
		</PageBox>
	)
}
