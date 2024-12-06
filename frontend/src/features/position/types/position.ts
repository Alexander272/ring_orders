export interface IPosition {
	id: string
	count: number
	name: string
	note: string
	amount: number
	made: number
	accepted: number
	// status: string
	isDeleted?: boolean
	isDone?: boolean
	isAccepted?: boolean
	// unit: string
}

export interface IPositionDTO {
	name: string | null
	note: string | null
	amount: number | null
}
