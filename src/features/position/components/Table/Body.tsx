import { FC } from 'react'
import { FixedSizeList } from 'react-window'

import { Fallback } from '@/components/Fallback/Fallback'
import { NoRowsOverlay } from '@/components/NoRowsOverlay/NoRowsOverlay'
import { TableBody } from '@/components/Table/TableBody'
import { ColWidth, RowHeight, Size } from '../../constants/defaultValues'
import { Columns } from '../../constants/columns'
import { Row } from './Row'
import { Footer } from './Footer'

type Props = {
	orderId: string
}

export const Body: FC<Props> = () => {
	const isLoading = false
	const isFetching = false

	const data = {
		data: [
			{
				id: '1',
				count: 1,
				name: '32x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 0,
				accepted: 0,
			},
			{
				id: '2',
				count: 2,
				name: '34x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 120,
				done: 40,
				accepted: 20,
			},
			{
				id: '3',
				count: 3,
				name: '38x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 160,
				done: 0,
				accepted: 0,
				isDeleted: true,
			},
			{
				id: '4',
				count: 4,
				name: '42x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 100,
				accepted: 80,
				isDone: true,
			},
			{
				id: '5',
				count: 5,
				name: '32x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 0,
				accepted: 0,
			},
			{
				id: '6',
				count: 6,
				name: '34x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 120,
				done: 40,
				accepted: 20,
			},
			{
				id: '7',
				count: 7,
				name: '38x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 160,
				done: 0,
				accepted: 0,
				isDeleted: true,
			},
			{
				id: '8',
				count: 8,
				name: '42x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 100,
				accepted: 80,
				isDone: true,
			},
			{
				id: '9',
				count: 9,
				name: '32x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 0,
				accepted: 0,
			},
			{
				id: '10',
				count: 10,
				name: '34x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 120,
				done: 40,
				accepted: 20,
			},
			{
				id: '11',
				count: 11,
				name: '38x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 160,
				done: 0,
				accepted: 0,
				isDeleted: true,
			},
			{
				id: '12',
				count: 12,
				name: '42x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 100,
				accepted: 80,
				isDone: true,
			},
			{
				id: '13',
				count: 13,
				name: '32x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 0,
				accepted: 0,
			},
			{
				id: '14',
				count: 14,
				name: '34x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 120,
				done: 40,
				accepted: 20,
			},
			{
				id: '15',
				count: 15,
				name: '38x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 160,
				done: 0,
				accepted: 0,
				isDeleted: true,
			},
			{
				id: '16',
				count: 16,
				name: '42x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 100,
				accepted: 80,
				isDone: true,
			},
			{
				id: '17',
				count: 17,
				name: '32x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 0,
				accepted: 0,
			},
			{
				id: '18',
				count: 18,
				name: '34x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 120,
				done: 40,
				accepted: 20,
			},
			{
				id: '19',
				count: 19,
				name: '38x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 160,
				done: 0,
				accepted: 0,
				isDeleted: true,
			},
			{
				id: '20',
				count: 20,
				name: '42x20x6 В-Б-00-ГФ2',
				comment: '',
				amount: 100,
				done: 100,
				accepted: 80,
				isDone: true,
			},
		],
		total: 20,
	}

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
						width={Columns.reduce((ac, cur) => ac + (cur?.width || ColWidth), 10)}
						// width={Columns.reduce((ac, cur) => ac + (hidden[cur.key] ? 0 : cur.width || ColWidth), 12)}
					>
						{({ index, style }) => <Row data={data.data[index]} sx={style} />}
					</FixedSizeList>
				)}
			</TableBody>
			<Footer total={data.total} />
		</>
	)
}
