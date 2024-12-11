import { FC, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'

import type { IFilter } from '@/app/types/params'
import type { IFullFilter } from '../../types/table'
import { FilterColumns } from '../../constants/columns'

type ListItem = { id: string; label: string }

type Props = {
	index: number
}

export const ListFilter: FC<Props> = ({ index }) => {
	const [options, setOptions] = useState<ListItem[]>([])
	const { control, setValue, watch } = useFormContext<{ filters: IFilter[] }>()
	const field = watch(`filters.${index}.field`).split('@')[0]
	const value = watch(`filters.${index}.value`)

	useEffect(() => {
		setOptions((FilterColumns.find(c => c.key == field)?.filter as IFullFilter).options as ListItem[])
	}, [field])

	useEffect(() => {
		if (options.length && value == '') setValue(`filters.${index}.value`, options[0].id)
	}, [options, value, setValue, index])

	return (
		<FormControl fullWidth>
			<InputLabel id={`filters.${index}.value`}>Значение</InputLabel>

			<Controller
				control={control}
				name={`filters.${index}.value`}
				rules={{ required: true }}
				render={({ field, fieldState: { error } }) => (
					<Select
						multiple
						labelId={`filters.${index}.value`}
						value={field.value.split('|')}
						error={Boolean(error)}
						onChange={({ target: { value } }) =>
							field.onChange(typeof value === 'string' ? value : value.join('|'))
						}
						input={<OutlinedInput label='Значение' />}
					>
						{options.map(r => (
							<MenuItem key={r.id} value={r.id}>
								{r.label}
							</MenuItem>
						))}
					</Select>
				)}
			/>
		</FormControl>
	)
}
