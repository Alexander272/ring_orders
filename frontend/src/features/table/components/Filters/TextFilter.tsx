import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'

import { IFilter } from '@/app/types/params'

const options = [
	{ value: 'con', label: 'Содержит' },
	{ value: 'like', label: 'Равен' },
	{ value: 'start', label: 'Начинается с' },
	{ value: 'end', label: 'Заканчивается на' },
]

type Props = {
	index: number
}

export const TextFilter: FC<Props> = ({ index }) => {
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
