import { FC } from 'react'

import { dataFormat, numberFormat } from '@/utils/format'
import { Table } from '@/components/Table/Table'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { TableHead } from '@/components/Table/TableHead'
import { TableRow } from '@/components/Table/TableRow'
import { TableCell } from '@/components/Table/TableCell'
import { TableBody } from '@/components/Table/TableBody'
import { useGetMadeQuery } from '../../madeApiSlice'

type Props = {
	id: string
}

export const Made: FC<Props> = ({ id }) => {
	const { data, isFetching } = useGetMadeQuery(id || '', { skip: !id })

	return (
		<Table>
			{isFetching && <TopFallback />}

			<TableHead>
				<TableRow height={36} sx={{ cursor: 'default' }}>
					<TableCell width={484}>Дата</TableCell>
					<TableCell width={360}>Количество</TableCell>
				</TableRow>
			</TableHead>

			<TableBody>
				{data?.data.map(d => (
					<TableRow key={d.id} height={36} hover sx={{ cursor: 'default' }}>
						<TableCell width={484}>{dataFormat(d.date * 1000)}</TableCell>
						<TableCell width={360}>{numberFormat(d.amount)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
