import type { IColumn } from '@/features/table/types/table'
import { numberFormat } from '@/utils/format'
import { Titles } from './titles'

export const Columns: IColumn[] = [
	{
		key: 'count',
		label: Titles.Count,
		width: 80,
	},
	{
		key: 'name',
		label: Titles.Name,
		width: 340,
	},
	{
		key: 'comment',
		label: Titles.Comment,
		width: 340,
	},
	{
		key: 'amount',
		label: Titles.Amount,
		width: 170,
		formatter: value => numberFormat(value as number),
	},
	{
		key: 'done',
		label: Titles.Done,
		width: 170,
		formatter: value => numberFormat(value as number),
	},
	{
		key: 'accepted',
		label: Titles.Accepted,
		width: 170,
		formatter: value => numberFormat(value as number),
	},
]
