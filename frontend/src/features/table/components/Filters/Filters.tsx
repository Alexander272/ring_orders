import { useRef, useState } from 'react'
import { Button } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { Badge } from '@/components/Badge/Badge'
import { FilterIcon } from '@/components/Icons/FilterIcon'
import { getFilters } from '../../tableSlice'

export const Filters = () => {
	const [_open, setOpen] = useState(false)
	const anchor = useRef(null)

	const filters = useAppSelector(getFilters)

	const toggleHandler = () => setOpen(prev => !prev)

	return (
		<>
			<Button
				ref={anchor}
				onClick={toggleHandler}
				variant='outlined'
				color='inherit'
				sx={{ minWidth: 30, paddingX: 1.5 }}
			>
				<Badge color='primary' variant={filters.length < 2 ? 'dot' : 'standard'} badgeContent={filters.length}>
					<FilterIcon fontSize={16} mr={1} />
				</Badge>
				Фильтр
			</Button>
		</>
	)
}
