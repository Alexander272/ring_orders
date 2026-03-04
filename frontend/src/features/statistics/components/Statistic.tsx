import { useState } from 'react'
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'

import { useGetPositionStatisticsQuery } from '../statisticsApiSlice'
import { Fallback } from '@/components/Fallback/Fallback'
import { Positions } from './Positions'
import { RefreshIcon } from '@/components/Icons/RefreshIcon'

const minDate = dayjs('2024-01-01')

export const Statistic = () => {
	const [start, setStart] = useState(dayjs().startOf('year').startOf('day'))
	const [end, setEnd] = useState(dayjs().endOf('year').startOf('day'))

	const { data, isFetching } = useGetPositionStatisticsQuery({ start: start.toISOString(), end: end.toISOString() })

	const startHandler = (value: Dayjs | null) => {
		if (value) setStart(value)
	}
	const endHandler = (value: Dayjs | null) => {
		if (value) setEnd(value)
	}

	const resetPeriod = () => {
		setStart(minDate.startOf('day'))
		setEnd(dayjs().endOf('year').startOf('day'))
	}

	return (
		<Stack position={'relative'}>
			{isFetching && (
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
			)}

			<Stack direction={'row'} alignSelf={'center'} alignItems={'center'} spacing={2} mb={3}>
				<Typography>с</Typography>
				<DatePicker
					value={start}
					onChange={startHandler}
					showDaysOutsideCurrentMonth
					fixedWeekNumber={6}
					minDate={minDate}
				/>

				<Typography>по</Typography>
				<DatePicker
					value={end}
					onChange={endHandler}
					showDaysOutsideCurrentMonth
					fixedWeekNumber={6}
					minDate={minDate}
				/>

				<Tooltip title={'Сбросить период'}>
					<Button
						onClick={resetPeriod}
						variant='outlined'
						color='inherit'
						sx={{ minWidth: 36, height: '100%' }}
					>
						<RefreshIcon fontSize={16} />
					</Button>
				</Tooltip>
			</Stack>

			<Positions data={data?.data || []} />
		</Stack>
	)
}
