import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import type { IFilter } from '@/app/types/params'
import type { IFullFilter } from '../../types/table'
import { FilterColumns } from '../../constants/columns'
import { FormControlLabel, Switch } from '@mui/material'

type ListItem = { id: string; label: string }

type Props = {
	index: number
}

export const SwitchFilter: FC<Props> = ({ index }) => {
	const methods = useFormContext<{ filters: IFilter[] }>()
	const field = methods.watch(`filters.${index}.field`).split('@')[0]
	const filter = FilterColumns.find(c => c.key == field)?.filter as IFullFilter
	const options = (filter.options as ListItem[]) || []

	return (
		<Controller
			control={methods.control}
			name={`filters.${index}.value`}
			render={({ field }) => (
				<FormControlLabel
					label={options.find(o => o.id == field.value)?.label}
					control={
						<Switch
							checked={field.value == 'true'}
							onChange={event => field.onChange(event.target.checked.toString())}
						/>
					}
				/>
			)}
		/>
	)
}
