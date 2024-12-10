import { IPosition, IPositionDTO } from '@/features/position/types/position'

export type Status = 'new' | 'processing' | 'closed'

export interface IOrder {
	id: string
	count: number
	orderNumber: string
	dateOfIssue: number
	dateOfDispatch: number
	dateOfAdoption: number
	closingDate: number
	urgent: boolean
	status: Status
	notes: string
	// positions: IPosition[]
}

export interface IOrderDTO {
	id?: string
	orderNumber: string
	dateOfIssue: number
	dateOfDispatch: number
	dateOfAdoption?: number
	closingDate?: number
	// dateOfExecution: number
	urgent: boolean
	notes: string
	status: Status
	positions?: IPositionDTO[]
}

export interface IEditOrderDTO extends IOrderDTO {
	positions?: IPosition[]
}

export interface IImportantOrders {
	urgent: number
	overdue: number
	nearest: number
}
