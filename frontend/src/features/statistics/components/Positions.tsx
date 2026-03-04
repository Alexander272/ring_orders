import { FC, Fragment, useState } from 'react'
import {
	Box,
	Collapse,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'

import type { IPositionStats } from '../types/stats'
import { LeftArrowIcon } from '@/components/Icons/LeftArrowIcon'
import { numberFormat } from '@/utils/format'

type Props = {
	data: IPositionStats[]
}

interface IGroup {
	year: number
	totalYearCount: number
	positions: IPositionStats[]
}

export const Positions: FC<Props> = ({ data }) => {
	const groupedData = data.reduce(
		(acc, item) => {
			if (!acc[item.year]) {
				acc[item.year] = {
					year: item.year,
					totalYearCount: 0,
					positions: [],
				}
			}
			acc[item.year].totalYearCount += item.totalCount
			acc[item.year].positions.push(item)
			return acc
		},
		{} as Record<number, IGroup>,
	)

	const sortedGroups = Object.values(groupedData).sort((a, b) => b.year - a.year)

	if (!sortedGroups.length)
		return (
			<Typography mt={2} align='center' fontSize={18}>
				За выбранный период нет позиций
			</Typography>
		)
	return (
		<TableContainer sx={{ maxHeight: 670, overflow: 'auto' }}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>Год</TableCell>
						<TableCell align='right'>Всего позиций</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{sortedGroups.map(group => (
						<CollapseRow key={group.year} {...group} />
					))}
				</TableBody>
				<TableFooter>
					{sortedGroups.length > 0 && (
						<TableRow>
							<TableCell>Всего</TableCell>
							<TableCell />
							<TableCell align='right'>
								{numberFormat(sortedGroups.reduce((acc, group) => acc + group.totalYearCount, 0))}
							</TableCell>
						</TableRow>
					)}
				</TableFooter>
			</Table>
		</TableContainer>
	)
}

const CollapseRow: FC<IGroup> = row => {
	const [open, setOpen] = useState(false)

	return (
		<Fragment>
			<TableRow sx={{ '& td, & th': { borderBottom: 'none' } }}>
				<TableCell>
					<IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
						<LeftArrowIcon
							fontSize={'16px'}
							fill={'#5e5e5e'}
							transform={open ? 'rotate(90deg)' : 'rotate(-90deg)'}
						/>
					</IconButton>
				</TableCell>
				<TableCell component='th' scope='row'>
					{row.year}
				</TableCell>
				<TableCell align='right'>{numberFormat(row.totalYearCount)}</TableCell>
			</TableRow>

			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
					<Collapse in={open} timeout='auto' unmountOnExit>
						<Box sx={{ margin: 1, maxHeight: 350, overflow: 'auto', mb: 1 }}>
							<Table size='small' aria-label='purchases'>
								<TableHead>
									<TableRow>
										<TableCell>Наименование</TableCell>
										<TableCell align='right'>Количество</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.positions.map(posRow => (
										<TableRow key={posRow.name}>
											<TableCell component='th' scope='row'>
												{posRow.name}
											</TableCell>
											<TableCell align='right'>{numberFormat(posRow.totalCount)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</Fragment>
	)
}
