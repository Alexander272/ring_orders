import dayjs from 'dayjs'

import type { IColumn } from '../types/table'
import { DateFormat } from '@/constants/date'
import { Titles } from './titles'

export const Columns: IColumn[] = [
	{
		key: 'count',
		label: Titles.Count,
		width: 150,
		allowsSorting: true,
	},
	{
		key: 'orderNumber',
		label: Titles.OrderNumber,
		width: 270,
		allowsSorting: true,
	},
	{
		key: 'dateOfIssue',
		label: Titles.DateOfIssue,
		width: 370,
		allowsSorting: true,
		formatter: value => {
			if (value == 0) return '-'
			else return dayjs((value as number) * 1000).format(DateFormat)
		},
	},
	{
		key: 'dateOfDispatch',
		label: Titles.DateOfDispatch,
		width: 370,
		allowsSorting: true,
		formatter: value => {
			if (value == 0) return '-'
			else return dayjs((value as number) * 1000).format(DateFormat)
		},
	},
	{
		key: 'closingDate',
		label: Titles.ClosingDate,
		width: 370,
		allowsSorting: true,
		formatter: value => {
			if (value == 0) return '-'
			else return dayjs((value as number) * 1000).format(DateFormat)
		},
	},
	{
		key: 'status',
		label: Titles.Status,
		width: 300,
		allowsSorting: true,
		isChip: true,
		formatter: value => {
			if (value == 'new') return 'Новый'
			else if (value == 'processing') return 'В работе'
			else if (value == 'closed') return 'Закрыт'
			return ''
		},
		styled: value => {
			const common = { padding: '3px 8px', borderRadius: '20px', width: '150px' }
			if (value == 'new') return { ...common, backgroundColor: '#062f93', color: '#fff' }
			if (value == 'processing') return { ...common, backgroundColor: '#53c958' }
			if (value == 'closed') return { ...common, backgroundColor: '#dfdfdf' }
			return {}
		},
	},
]
