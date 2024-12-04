import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { TableHead } from '@/components/Table/TableHead'
import { TableRow } from '@/components/Table/TableRow'
import { TableCell } from '@/components/Table/TableCell'
import { CellText } from '@/components/CellText/CellText'
import { Columns } from '../../constants/columns'
import { getTableSort, setSort } from '../../tableSlice'
import { ArrowsIcon } from '@/components/Icons/ArrowsIcon'
import { Badge } from '@/components/Badge/Badge'
import { ColWidth } from '../../constants/defaultValues'

export const Head = () => {
	const sort = useAppSelector(getTableSort)

	const dispatch = useAppDispatch()

	const setSortHandler = (field: string) => () => {
		dispatch(setSort(field))
	}

	return (
		<TableHead>
			<TableRow width={Columns.reduce((acc, c) => acc + (c?.width || ColWidth), 8)}>
				{Columns.map(c => (
					<TableCell
						key={c.key}
						width={c.width}
						isActive
						onClick={c.allowsSorting ? setSortHandler(c.key) : undefined}
					>
						<CellText value={c.label} />

						{sort[c.key] ? (
							<Badge
								color='primary'
								badgeContent={Object.keys(sort).findIndex(k => k == c.key) + 1}
								invisible={Object.keys(sort).length < 2}
							>
								<ArrowsIcon
									sx={{
										fontSize: 16,
										transform: sort[c.key] == 'ASC' ? '' : 'rotate(180deg)',
										transition: '.2s all ease-in-out',
									}}
								/>
							</Badge>
						) : null}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	)
}
