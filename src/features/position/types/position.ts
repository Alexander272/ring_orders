export interface IPosition {
	id: string
	count: number
	name: string
	comment: string
	amount: number
	done: number
	accepted: number
	// status: string
	isDeleted?: boolean
	isDone?: boolean
	isAccepted?: boolean
	// unit: string
}

export interface IPositionDTO {
	name: string | null
	comment: string | null
	amount: number | null
}
