import { FC } from 'react'
import { FixedSizeList } from 'react-window'

import { PermRules } from '@/constants/permissions'
import { useCheckPermission } from '@/features/auth/hooks/check'
import { Fallback } from '@/components/Fallback/Fallback'
import { NoRowsOverlay } from '@/components/NoRowsOverlay/NoRowsOverlay'
import { TableBody } from '@/components/Table/TableBody'
import { ColWidth, RowHeight, Size } from '../../constants/defaultValues'
import { Columns } from '../../constants/columns'
import { useGetPositionsQuery } from '../../positionApiSlice'
import { Row } from './Row'
import { Footer } from './Footer'

type Props = {
	orderId: string
}

export const Body: FC<Props> = ({ orderId }) => {
	const canAccept = useCheckPermission(PermRules.Accept.Write)
	const { data, isFetching, isLoading } = useGetPositionsQuery(
		{ orderId, sort: canAccept ? 'isAccepted' : 'isDone' },
		{ skip: !orderId }
	)

	if (!isLoading && !data?.total) return <NoRowsOverlay />
	return (
		<>
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
						height={RowHeight * (data.data.length > Size ? Size : data.data.length) + 2}
						itemCount={data.data.length}
						itemSize={RowHeight}
						width={Columns.reduce((ac, cur) => ac + (cur?.width || ColWidth), 14)}
						// width={Columns.reduce((ac, cur) => ac + (hidden[cur.key] ? 0 : cur.width || ColWidth), 12)}
					>
						{({ index, style }) => <Row data={data.data[index]} sx={style} />}
					</FixedSizeList>
				)}
			</TableBody>
			<Footer total={data?.total || 0} />
		</>
	)
}
