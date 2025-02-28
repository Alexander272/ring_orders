export interface ISent {
	id: string
	positionId: string
	// count: number
	// name: string
	date: number
	quantity: number
}

export interface ISentDTO {
	positionId: string
	count: number | null
	name: string | null
	remainder: number | null
	quantity: number | null
}
