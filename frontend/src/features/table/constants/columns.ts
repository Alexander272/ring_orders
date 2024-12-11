import dayjs from 'dayjs'

import type { IColumn, IFilterColumn } from '../types/table'
import { DateFormat } from '@/constants/date'
import { Titles } from './titles'

export const Columns: IColumn[] = [
	{
		key: 'count',
		label: Titles.Count,
		width: 150,
		allowsSorting: true,
		filter: 'number',
	},
	{
		key: 'orderNumber',
		label: Titles.OrderNumber,
		width: 270,
		allowsSorting: true,
		filter: 'string',
	},
	{
		key: 'dateOfIssue',
		label: Titles.DateOfIssue,
		width: 370,
		allowsSorting: true,
		filter: 'date',
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
		filter: 'date',
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
		filter: 'date',
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
		filter: {
			type: 'list',
			options: [
				{ id: 'new', label: 'Новый' },
				{ id: 'processing', label: 'В работе' },
				{ id: 'closed', label: 'Закрыт' },
			],
		},
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

export const FilterColumns: IFilterColumn[] = [
	{ key: 'count', label: Titles.Count, filter: 'number' },
	{ key: 'orderNumber', label: Titles.OrderNumber, filter: 'string' },
	{ key: 'dateOfIssue', label: Titles.DateOfIssue, filter: 'date' },
	{ key: 'dateOfDispatch', label: Titles.DateOfDispatch, filter: 'date' },
	{ key: 'closingDate', label: Titles.ClosingDate, filter: 'date' },
	{
		key: 'urgent',
		label: Titles.Urgent,
		filter: {
			type: 'switch',
			options: [
				{ id: 'true', label: 'Срочный' },
				{ id: 'false', label: 'Обычный' },
			],
		},
	},
	{
		key: 'status',
		label: Titles.Status,
		filter: {
			type: 'list',
			options: [
				{ id: 'new', label: 'Новый' },
				{ id: 'processing', label: 'В работе' },
				{ id: 'closed', label: 'Закрыт' },
			],
		},
	},
]
