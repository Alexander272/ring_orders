import { FC } from 'react'

import { Table } from '@/components/Table/Table'
import { TableHead } from '@/components/Table/TableHead'
import { TableRow } from '@/components/Table/TableRow'
import { TableCell } from '@/components/Table/TableCell'
import { CellText } from '@/components/CellText/CellText'
import { EditColumns } from '../../constants/columns'
import { RowHeight } from '../../constants/defaultValues'
import { Body } from './Body'

type Props = {}

export const EditTable: FC<Props> = () => {
	return (
		<Table>
			<TableHead>
				<TableRow width={EditColumns.reduce((acc, c) => acc + (c?.width || 0), 14)} height={RowHeight}>
					{EditColumns.map(c => (
						<TableCell key={c.key} width={c.width}>
							<CellText value={c.label} />
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<Body />
		</Table>
	)
}
