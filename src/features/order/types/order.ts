import { IPosition } from './position'

export interface IOrder {
	id: string
	count: number
	orderNumber: string
	dateOfIssue: number
	dateOfDispatch: number
	closingDate: number
	urgent: boolean
	status: 'new' | 'processing' | 'closed'
}

export interface IOrderDTO {
	id: string
	orderNumber: string
	dateOfIssue: number
	dateOfDispatch: number
	// dateOfExecution: number
	urgent: boolean
	positions: IPosition[]
}
