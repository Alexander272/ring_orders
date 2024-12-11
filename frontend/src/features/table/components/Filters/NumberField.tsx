import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'

import type { IFilter } from '@/app/types/params'

const options = [
	{ value: 'eq', label: 'Равно' },
	{ value: 'gte', label: 'Больше или равно' },
	{ value: 'lte', label: 'Меньше или равно' },
]

type Props = {
	index: number
}

export const NumberFilter: FC<Props> = ({ index }) => {
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
				name={`filters.${index}.value`}
				control={methods.control}
				rules={{ required: true }}
				render={({ field, fieldState: { error } }) => (
					<TextField label='Значение' {...field} error={Boolean(error)} fullWidth />
				)}
			/>
		</>
	)
}
