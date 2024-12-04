import { FixedSizeList } from 'react-window'

import { useAppSelector } from '@/hooks/redux'
import { Fallback } from '@/components/Fallback/Fallback'
import { NoRowsOverlay } from '@/components/NoRowsOverlay/components/NoRowsOverlay'
import { TableBody } from '@/components/Table/TableBody'
import { ColWidth, RowHeight, Size } from '../../constants/defaultValues'
import { Columns } from '../../constants/columns'
import { getTableSize } from '../../tableSlice'
import { Row } from './Row'
import { IOrder } from '@/features/order/types/order'

export const Body = () => {
	const size = useAppSelector(getTableSize)

	const isLoading = false
	const isFetching = false
	const data: { data: IOrder[]; total: number } = {
		data: [
			{
				id: '1',
				count: 1,
				orderNumber: '11534',
				dateOfIssue: 1732734000,
				dateOfDispatch: 1734030000,
				closingDate: 0,
				urgent: false,
				status: 'processing',
			},
			{
				id: '2',
				count: 2,
				orderNumber: '11545',
				dateOfIssue: 1732734000,
				dateOfDispatch: 1733684400,
				closingDate: 0,
				urgent: false,
				status: 'processing',
			},
			{
				id: '3',
				count: 3,
				orderNumber: '11563',
				dateOfIssue: 1733079600,
				dateOfDispatch: 1733511600,
				closingDate: 0,
				urgent: true,
				status: 'new',
			},
			{
				id: '4',
				count: 3,
				orderNumber: '11563',
				dateOfIssue: 1733079600,
				dateOfDispatch: 1733511600,
				closingDate: 0,
				urgent: false,
				status: 'closed',
			},
		],
		total: 5,
	}

	if (!isLoading && !data?.total) return <NoRowsOverlay />
	return (
		<TableBody>
			{isFetching || isLoading ? (
				<Fallback
					position={'absolute'}
					top={'50%'}
					left={'50%'}
					transform={'translate(-50%, -50%)'}
					height={160}
					width={160}
					borderRadius={3}
					zIndex={15}
					backgroundColor={'#fafafa'}
				/>
			) : null}

			{data && (
				<FixedSizeList
					overscanCount={10}
					height={RowHeight * Size}
					itemCount={data.data.length > (size || Size) ? size || Size : data.data.length}
					itemSize={RowHeight}
					width={Columns.reduce((ac, cur) => ac + (cur?.width || ColWidth), 10)}
					// width={Columns.reduce((ac, cur) => ac + (hidden[cur.key] ? 0 : cur.width || ColWidth), 12)}
				>
					{({ index, style }) => <Row data={data.data[index]} sx={style} />}
				</FixedSizeList>
			)}
		</TableBody>
	)
}
