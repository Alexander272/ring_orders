import { CellComponent, Column } from 'react-datasheet-grid'
import { SelectComponent } from './SelectColumn'

export interface Choice {
	label: string
	value: string
}

export type SelectOptions = {
	choices: Choice[]
	// Let's add more options!
	disabled?: boolean
}

export const selectColumn = (
	// We receive the options as a parameter to create the column object
	options: SelectOptions
): Column<string | null, SelectOptions> => ({
	component: SelectComponent as CellComponent<string | null, SelectOptions>,
	// We pass the options to the cells using the `columnData`property
	columnData: options,
	// We set other column properties so we don't have to do it manually every time we use the column
	disableKeys: true,
	keepFocus: true,
	// We can also use the options to customize some properties
	disabled: options.disabled,
	deleteValue: () => null,
	copyValue: ({ rowData }) => options.choices.find(choice => choice.value === rowData)?.label || '',
	pasteValue: ({ value }) => options.choices.find(choice => choice.label === value)?.value ?? null,
})
