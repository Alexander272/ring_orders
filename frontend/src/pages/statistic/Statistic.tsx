import { Box, Breadcrumbs, Typography } from '@mui/material'

import { AppRoutes } from '@/constants/routes'
import { PageBox } from '@/styled/PageBox'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { Statistic } from '@/features/statistics/components/Statistic'

export default function StatisticPage() {
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
				<Breadcrumbs aria-label='breadcrumb' sx={{ position: 'absolute', zIndex: 15 }}>
					<Breadcrumb to={AppRoutes.Home}>Главная</Breadcrumb>
					<Breadcrumb to={AppRoutes.Statistics} active>
						Статистика
					</Breadcrumb>
				</Breadcrumbs>

				<Typography variant={'h6'} textAlign={'center'} mb={1}>
					Статистика за период
				</Typography>

				<Statistic />
			</Box>
		</PageBox>
	)
}
