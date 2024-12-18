export interface INotification {
	id: string
	userId: string
	title: string
	text: string
	link: string
	date: number
	priority: Priority
}

type Priority = 0 | 1 | 2 | 3
