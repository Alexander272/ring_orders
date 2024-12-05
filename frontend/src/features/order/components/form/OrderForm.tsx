import { useState } from 'react'
import { Breadcrumbs, Button, FormControl, Stack, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { Column, DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import dayjs from 'dayjs'

import type { IPositionDTO } from '../../../position/types/position'
import { AppRoutes } from '@/constants/routes'
import { removeSpace } from '@/utils/format'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { ContextMenu } from '@/components/DataSheet/ContextMenu'
import { AddRow } from '@/components/DataSheet/AddRow'
import { Checkbox } from '@/components/Checkbox/Checkbox'

export const OrderForm = () => {
	const [rows, setRows] = useState<IPositionDTO[]>([{ name: null, comment: null, amount: null }])

	// const countPaste = (values: string[]) => {
	// 	return values.map(v => v.replace(/\s+/g, ''))
	// }

	const columns: Column<IPositionDTO>[] = [
		{ ...keyColumn<IPositionDTO, 'name'>('name', textColumn), title: 'Наименование' },
		{ ...keyColumn<IPositionDTO, 'comment'>('comment', textColumn), title: 'Комментарий' },
		{ ...keyColumn<IPositionDTO, 'amount'>('amount', intColumn), title: 'Изготовить', prePasteValues: removeSpace },
	]

	return (
		<Stack mt={2} mb={2} spacing={2}>
			<Stack>
				<Typography fontSize={'1.4rem'} pl={0.5}>
					Новый заказ
				</Typography>

				<Breadcrumbs aria-label='breadcrumb'>
					<Breadcrumb to={AppRoutes.Home}>Главная</Breadcrumb>
					<Breadcrumb to={AppRoutes.NewOrder} active>
						Новый заказ
					</Breadcrumb>
				</Breadcrumbs>
			</Stack>
			{/* //TODO можно по нажатию кнопки сохранить вызывать функцию сохранения у dataSheet, а полосу с кнопками скрыть */}
			{/* только надо придумать как эту функцию вызывать */}
			{/* а еще если будут скрыты кнопки, то нужно будет реализовать автоматическое добавление пустой строки снизу */}
			{/* Надо еще куда нибудь засунуть галочку что заказ срочный */}

			{/* //TODO надо бы наверное показывать что такой номер заказа уже есть и предлагать ввести дробную часть */}
			{/* еще можно явно указывать связь с уже созданными заказами */}

			{/* Header №order, dateOfIssue, dateOfExecution */}
			<Stack direction={'row'} justifyContent={'space-between'} spacing={2}>
				<TextField label='Номер заказа' fullWidth />

				<FormControl fullWidth>
					<DatePicker label='Дата выдачи' defaultValue={dayjs()} />
				</FormControl>
				<FormControl fullWidth>
					<DatePicker label='Дата исполнения' defaultValue={dayjs().add(10, 'day')} />
				</FormControl>
				{/* <TextField label='Дата выдачи' fullWidth /> */}
				{/* <TextField label='Дата исполнения' fullWidth /> */}
			</Stack>
			<Checkbox label='Срочный' />

			{/* Positions */}
			<DataSheetGrid
				value={rows}
				onChange={setRows}
				columns={columns}
				autoAddRow
				height={500}
				contextMenuComponent={props => <ContextMenu {...props} />}
				addRowsComponent={props => <AddRow {...props} />}
			/>

			{/* Note */}
			<TextField multiline rows={4} label='Комментарий' />
			<Stack direction={'row'} spacing={2} justifyContent={'center'}>
				<Button variant='outlined' color='inherit' fullWidth sx={{ maxWidth: 260 }}>
					Отменить
				</Button>
				<Button variant='outlined' fullWidth sx={{ maxWidth: 260 }}>
					Сохранить
				</Button>
			</Stack>
		</Stack>
	)
}
