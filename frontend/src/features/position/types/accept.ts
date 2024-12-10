export interface IAccept {
	id: string
	positionId: string
	// count: number
	// name: string
	date: number
	amount: number
}

export interface IAcceptDTO {
	positionId: string
	count: number | null
	name: string | null
	remainder: number | null
	amount: number | null
}
