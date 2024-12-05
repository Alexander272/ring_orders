import { Box } from '@mui/material'

import { PageBox } from '@/styled/PageBox'
import { OrdersTable } from '@/features/table/components/OrdersTable'

export default function Home() {
	return (
		<PageBox>
			<Box
				borderRadius={3}
				paddingX={2}
				paddingY={1}
				width={'100%'}
				border={'1px solid rgba(0, 0, 0, 0.12)'}
				// flexGrow={1}
				height={'fit-content'}
				minHeight={600}
				maxHeight={800}
				display={'flex'}
				flexDirection={'column'}
				sx={{ backgroundColor: '#fff', userSelect: 'none' }}
			>
				<OrdersTable />
			</Box>
		</PageBox>
	)
}
