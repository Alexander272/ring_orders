import { IPosition } from '@/features/position/types/position'

export interface IOrder {
	id: string
	count: number
	orderNumber: string
	dateOfIssue: number
	dateOfDispatch: number
	closingDate: number
	urgent: boolean
	status: 'new' | 'processing' | 'closed'
	notes: string
	positions: IPosition[]
}

export interface IOrderDTO {
	id: string
	orderNumber: string
	dateOfIssue: number
	dateOfDispatch: number
	// dateOfExecution: number
	urgent: boolean
	notes: string
	positions: IPosition[]
}
