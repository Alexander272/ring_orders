import { FixedSizeList } from 'react-window'

import { useAppSelector } from '@/hooks/redux'
import { Fallback } from '@/components/Fallback/Fallback'
import { NoRowsOverlay } from '@/components/NoRowsOverlay/NoRowsOverlay'
import { TableBody } from '@/components/Table/TableBody'
import { ColWidth, MaxSize, RowHeight, Size } from '../../constants/defaultValues'
import { Columns } from '../../constants/columns'
import { getTableSize } from '../../tableSlice'
import { useGetAllData } from '../../hooks/query'
import { Row } from './Row'

export const Body = () => {
	const size = useAppSelector(getTableSize)

	const { data, isFetching, isLoading } = useGetAllData()

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
					height={RowHeight * (size > Size ? MaxSize : Size)}
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
