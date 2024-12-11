import { SxProps } from '@mui/material'

export interface IHeadColumn {
	key: string
	label: string
	width?: number
	align?: 'center' | 'right' | 'left'
	allowsSorting?: boolean
	children?: IHeadColumn[]
}

export type FilterType = 'number' | 'string' | 'date' | 'switch' | 'list'
export interface IFullFilter {
	type: FilterType
	options?: unknown[]
	// getOptions?: (arg: unknown) => unknown
}
export interface IColumn {
	key: string
	label: string
	width?: number
	align?: 'center' | 'right' | 'left'
	isShow?: boolean
	isChip?: boolean
	// allowSearch?: boolean
	allowsSorting?: boolean
	filter?: FilterType | IFullFilter
	formatter?: (value: unknown) => string
	styled?: (value: unknown) => SxProps
}

export interface IFilterColumn {
	key: string
	label: string
	filter?: FilterType | IFullFilter
}

export interface IContextMenu {
	active: string
	coords: ICoordinates
}

export interface ICoordinates {
	mouseX: number
	mouseY: number
}

export interface ISelect {
	[id: string]: boolean
}

export interface ISort {
	[x: string]: 'DESC' | 'ASC'
}

export type CompareTypes = 'con' | 'start' | 'end' | 'like' | 'in' | 'eq' | 'gte' | 'lte'
export interface IFilter {
	field: string
	fieldType: string
	compareType: CompareTypes
	value: string
}
