import { useState } from 'react'
import { Breadcrumbs, Button, FormControl, Stack, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { Column, DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import type { IFetchError } from '@/app/types/error'
import type { IPositionDTO } from '@/features/position/types/position'
import type { IOrderDTO } from '../../types/order'
import { AppRoutes } from '@/constants/routes'
import { removeSpace } from '@/utils/format'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { ContextMenu } from '@/components/DataSheet/ContextMenu'
import { AddRow } from '@/components/DataSheet/AddRow'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { useCreateOrderMutation } from '../../orderApiSlice'

const defaultValues: IOrderDTO = {
	orderNumber: '',
	dateOfIssue: dayjs().unix(),
	dateOfDispatch: dayjs().add(10, 'day').unix(),
	urgent: false,
	notes: '',
	status: 'new',
	positions: [],
}

export const OrderForm = () => {
	const navigate = useNavigate()
	const [rows, setRows] = useState<IPositionDTO[]>([{ name: null, note: null, amount: null }])

	const { control, handleSubmit, reset } = useForm<IOrderDTO>({ defaultValues })

	const [create] = useCreateOrderMutation()

	const cancelHandler = () => {
		navigate(AppRoutes.Home)
	}

	const saveHandler = async (form: IOrderDTO) => {
		console.log(form)

		// const positions = [...rows]
		// console.log('keys', Object.keys(positions[1]))

		const positions = rows.filter(p => p.name)
		if (positions.some(p => !p.amount)) {
			toast.error('Поле "Изготовить, шт" обязательно для заполнения')
			return
		}
		positions.forEach(p => {
			if (p.note == null) p.note = ''
		})
		form.positions = positions

		try {
			await create(form).unwrap()
			toast.success('Заказ успешно создан')
			reset()
			setRows([{ name: null, note: null, amount: null }])
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	const columns: Column<IPositionDTO>[] = [
		{ ...keyColumn<IPositionDTO, 'name'>('name', textColumn), title: 'Наименование' },
		{ ...keyColumn<IPositionDTO, 'note'>('note', textColumn), title: 'Комментарий' },
		{
			...keyColumn<IPositionDTO, 'amount'>('amount', intColumn),
			title: 'Изготовить, шт',
			prePasteValues: removeSpace,
		},
	]

	return (
		<Stack mt={2} mb={2} spacing={2} component={'form'} onSubmit={handleSubmit(saveHandler)}>
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

			{/* //TODO надо бы наверное показывать что такой номер заказа уже есть и предлагать ввести дробную часть */}
			{/* еще можно явно указывать связь с уже созданными заказами */}

			{/* Header №order, dateOfIssue, dateOfExecution */}
			<Stack direction={'row'} justifyContent={'space-between'} spacing={2}>
				<Controller
					control={control}
					name={'orderNumber'}
					render={({ field }) => <TextField {...field} label='Номер заказа' fullWidth />}
				/>

				<FormControl fullWidth>
					<Controller
						control={control}
						name={'dateOfIssue'}
						render={({ field }) => (
							<DatePicker
								{...field}
								value={dayjs(field.value * 1000)}
								onChange={value => {
									field.onChange(value?.startOf('d').unix())
								}}
								label='Дата заказа'
							/>
						)}
					/>
				</FormControl>
				<FormControl fullWidth>
					<Controller
						control={control}
						name={'dateOfDispatch'}
						render={({ field }) => (
							<DatePicker
								{...field}
								value={dayjs(field.value * 1000)}
								onChange={value => {
									field.onChange(value?.startOf('d').unix())
								}}
								label='Дата исполнения'
							/>
						)}
					/>
				</FormControl>
			</Stack>
			<Controller
				control={control}
				name={'urgent'}
				render={({ field }) => (
					<Checkbox id={field.name} value={field.value} onChange={field.onChange} label='Срочный' />
				)}
			/>

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
			<Controller
				control={control}
				name={'notes'}
				render={({ field }) => <TextField {...field} multiline rows={4} label='Примечание' />}
			/>

			{/* Buttons */}
			<Stack direction={'row'} spacing={2} justifyContent={'center'}>
				<Button onClick={cancelHandler} variant='outlined' color='inherit' fullWidth sx={{ maxWidth: 260 }}>
					Отменить
				</Button>
				<Button type='submit' variant='outlined' fullWidth sx={{ maxWidth: 260 }}>
					Сохранить
				</Button>
			</Stack>
		</Stack>
	)
}
