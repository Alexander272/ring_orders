import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material'
import dayjs from 'dayjs'

import type { CompareTypes, IFilter } from '@/app/types/params'
import { TimesIcon } from '@/components/Icons/TimesIcon'
import { FilterColumns } from '../../constants/columns'
import { TextFilter } from './TextFilter'
import { NumberFilter } from './NumberField'
import { DateFilter } from './DateFilter'
import { ListFilter } from './ListFilter'
import { SwitchFilter } from './SwitchFilter'

const compareTypes = new Map([
	['string', 'con'],
	['date', 'eq'],
	['number', 'eq'],
	['switch', 'eq'],
	['list', 'in'],
])
const defaultValues = new Map([
	['string', ''],
	['date', dayjs().unix().toString()],
	['number', ''],
	['switch', 'false'],
])

type Props = {
	index: number
	onRemove: (index: number) => void
}

export const FilterItem: FC<Props> = ({ index, onRemove }) => {
	const methods = useFormContext<{ filters: IFilter[] }>()
	const type = methods.watch(`filters.${index}.fieldType`)

	const removeHandler = () => onRemove(index)

	return (
		<Stack direction={'row'} spacing={1} alignItems={'center'}>
			<FormControl fullWidth sx={{ maxWidth: 170 }}>
				<InputLabel id={`filters.${index}.field`}>Колонка</InputLabel>

				<Controller
					control={methods.control}
					name={`filters.${index}.field`}
					render={({ field, fieldState: { error } }) => (
						<Select
							value={field.value}
							onChange={(event: SelectChangeEvent) => {
								const newType = event.target.value.split('@')[1]
								if (newType != type) {
									methods.setValue(`filters.${index}.fieldType`, event.target.value.split('@')[1])
									methods.setValue(
										`filters.${index}.compareType`,
										(compareTypes.get(newType) || 'con') as CompareTypes
									)
									methods.setValue(`filters.${index}.value`, defaultValues.get(newType) || '')
								}
								field.onChange(event.target.value)
							}}
							labelId={`filters.${index}.field`}
							label={'Колонка'}
							error={Boolean(error)}
						>
							{FilterColumns.map(c => (
								<MenuItem
									key={c.key}
									value={`${c.key}@${typeof c.filter == 'string' ? c.filter : c.filter?.type}`}
								>
									{c.label}
								</MenuItem>
							))}
						</Select>
					)}
				/>
			</FormControl>

			{type == 'string' && <TextFilter index={index} />}
			{type == 'number' && <NumberFilter index={index} />}
			{type == 'date' && <DateFilter index={index} />}
			{type == 'switch' && <SwitchFilter index={index} />}
			{type == 'list' && <ListFilter index={index} />}

			{index != 0 && (
				<IconButton onClick={removeHandler}>
					<TimesIcon fontSize={18} padding={0.4} />
				</IconButton>
			)}
		</Stack>
	)
}
