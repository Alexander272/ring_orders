import { FC } from 'react'

import { Table } from '@/components/Table/Table'
import { TableHead } from '@/components/Table/TableHead'
import { TableRow } from '@/components/Table/TableRow'
import { TableCell } from '@/components/Table/TableCell'
import { CellText } from '@/components/CellText/CellText'
import { RowHeight } from '../../constants/defaultValues'
import { Columns } from '../../constants/columns'
import { MadeDialog } from '../Dialog/MadeDialog'
import { Body } from './Body'

type Props = {
	orderId: string
}

export const PositionTable: FC<Props> = ({ orderId }) => {
	return (
		<Table>
			<TableHead>
				<TableRow width={Columns.reduce((acc, c) => acc + (c?.width || 0), 14)} height={RowHeight}>
					{Columns.map(c => (
						<TableCell key={c.key} width={c.width}>
							<CellText value={c.label} />
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<Body orderId={orderId} />

			<MadeDialog />
		</Table>
	)
}
