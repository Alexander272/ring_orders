import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

import type { IFilter } from '@/app/types/params'

const options = [
	{ value: 'eq', label: 'Равна' },
	{ value: 'gte', label: 'Больше или равна' },
	{ value: 'lte', label: 'Меньше или равна' },
]

type Props = {
	index: number
}

export const DateFilter: FC<Props> = ({ index }) => {
	const methods = useFormContext<{ filters: IFilter[] }>()

	return (
		<>
			<Controller
				name={`filters.${index}.compareType`}
				control={methods.control}
				rules={{ required: true }}
				render={({ field, fieldState: { error } }) => (
					<FormControl fullWidth sx={{ maxWidth: 170 }}>
						<InputLabel id={`filters.${index}.compareType`}>Условие</InputLabel>

						<Select
							{...field}
							error={Boolean(error)}
							labelId={`filters.${index}.compareType`}
							label='Условие'
						>
							{options.map(({ value, label }) => (
								<MenuItem key={value} value={value}>
									{label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
			/>

			<Controller
				control={methods.control}
				name={`filters.${index}.value`}
				rules={{ required: true }}
				render={({ field, fieldState: { error } }) => (
					<DatePicker
						{...field}
						value={field.value ? dayjs(+field.value * 1000) : null}
						onChange={value => field.onChange(value?.startOf('d').unix())}
						label={'Значение'}
						showDaysOutsideCurrentMonth
						fixedWeekNumber={6}
						slotProps={{
							textField: {
								fullWidth: true,
								error: Boolean(error),
							},
						}}
					/>
				)}
			/>
		</>
	)
}
