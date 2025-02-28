export interface IPosition {
	id: string
	count: number
	name: string
	note: string
	amount: number
	made: number
	accepted: number
	sent: number
	// status: string
	isDeleted?: boolean
	isDone?: boolean
	isAccepted?: boolean
	isSent?: boolean
	// unit: string
}

export interface IEditPositionDTO {
	id: string
	count: number
	name: string | null
	note: string | null
	amount: number | null
	made: number | null
	accepted: number | null
	sent: number | null
	isDeleted?: boolean
}

export interface IPositionDTO {
	count: number
	name: string | null
	note: string | null
	amount: number | null
}

export interface IGetPosition {
	orderId: string
	sort?: string
}
