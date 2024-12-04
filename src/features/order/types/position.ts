export interface IPosition {
	id: string
	name: string
	comment: string
	count: number
	// unit: string
}

export interface IPositionDTO {
	name: string | null
	comment: string | null
	count: number | null
}
