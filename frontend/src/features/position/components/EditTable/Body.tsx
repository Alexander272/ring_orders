import { FC } from 'react'
import { FixedSizeList } from 'react-window'
import { useFormContext } from 'react-hook-form'

import type { IEditOrderDTO } from '@/features/order/types/order'
import { NoRowsOverlay } from '@/components/NoRowsOverlay/NoRowsOverlay'
import { TableBody } from '@/components/Table/TableBody'
import { ColWidth, RowHeight, Size } from '../../constants/defaultValues'
import { EditColumns } from '../../constants/columns'
import { Row } from './Row'

type Props = {}

export const Body: FC<Props> = () => {
	const { setValue, watch } = useFormContext<IEditOrderDTO>()
	const positions = watch('positions')

	const deleteHandler = (index: number) => () => {
		setValue(`positions.${index}.isDeleted`, true, { shouldDirty: true })
	}

	if (!positions) return <NoRowsOverlay />
	return (
		<>
			<TableBody>
				<FixedSizeList
					overscanCount={10}
					height={RowHeight * (positions.length > Size ? Size : positions.length) + 2}
					itemCount={positions.length}
					itemSize={RowHeight}
					width={EditColumns.reduce((ac, cur) => ac + (cur?.width || ColWidth), 14)}
				>
					{({ index, style }) => <Row data={positions[index]} onDelete={deleteHandler(index)} sx={style} />}
				</FixedSizeList>
			</TableBody>
		</>
	)
}
