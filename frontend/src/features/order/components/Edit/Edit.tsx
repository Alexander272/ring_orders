import { FC } from 'react'
import { Breadcrumbs, Button, FormControl, Stack, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import type { IFetchError } from '@/app/types/error'
import type { IPosition } from '@/features/position/types/position'
import type { IEditOrderDTO } from '../../types/order'
import { AppRoutes } from '@/constants/routes'
import { DateFormat } from '@/constants/date'
import { useGetPositionsQuery, useUpdatePositionsMutation } from '@/features/position/positionApiSlice'
import { EditTable } from '@/features/position/components/EditTable/EditTable'
import { Fallback } from '@/components/Fallback/Fallback'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Confirm } from '@/components/Confirm/Confirm'
import { useDeleteOrderMutation, useGetOrderByIdQuery, useUpdateOrderMutation } from '../../orderApiSlice'

type Props = {
	id: string
}

const defaultValues: IEditOrderDTO = {
	orderNumber: '',
	dateOfIssue: dayjs().unix(),
	dateOfDispatch: dayjs().add(10, 'day').unix(),
	urgent: false,
	notes: '',
	status: 'new',
	positions: [],
}

export const Edit: FC<Props> = ({ id }) => {
	const navigate = useNavigate()

	const { data, isFetching } = useGetOrderByIdQuery(id, { skip: !id })
	const { data: positions } = useGetPositionsQuery({ orderId: id }, { skip: !id })

	const [remove, { isLoading: isDeleting }] = useDeleteOrderMutation()
	const [update, { isLoading: isUpdating }] = useUpdateOrderMutation()
	const [updatePositions, { isLoading: isUpdatingPositions }] = useUpdatePositionsMutation()

	const methods = useForm<IEditOrderDTO>({
		defaultValues,
		values: { ...(data?.data || defaultValues), positions: positions?.data || [] },
	})
	const {
		control,
		handleSubmit,
		formState: { dirtyFields },
	} = methods

	const cancelHandler = () => {
		navigate(AppRoutes.Order.replace(':id', id))
	}

	const deleteHandler = async () => {
		try {
			await remove(id).unwrap()
			toast.success('Заказ удален')
			navigate(AppRoutes.Home)
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	const submitHandler = handleSubmit(async form => {
		console.log(form, dirtyFields)

		const newPositions: IPosition[] = []
		if (dirtyFields.positions) {
			dirtyFields.positions.forEach((_p, i) => {
				newPositions.push(form.positions![i])
			})
		}
		let hasChanges = false
		if (Object.keys(dirtyFields).some(k => k != 'positions')) hasChanges = true

		try {
			if (newPositions.length) await updatePositions(newPositions).unwrap()
			if (hasChanges) await update(form).unwrap()
			toast.success('Заказ обновлен')
			navigate(AppRoutes.Order.replace(':id', id))
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	})

	if (isFetching) return <Fallback />
	if (!data) return null
	return (
		<Stack mt={1} mb={2} position={'relative'} component={'form'} onSubmit={submitHandler}>
			{isDeleting || isUpdating || isUpdatingPositions ? <TopFallback /> : null}

			<Stack>
				<Typography fontSize={'1.4rem'} pl={0.5} display={'flex'} alignItems={'center'}>
					Заказ №{data.data.count} ({data.data.orderNumber})
				</Typography>

				<Breadcrumbs aria-label='breadcrumb'>
					<Breadcrumb to={AppRoutes.Home}>Главная</Breadcrumb>
					<Breadcrumb to={AppRoutes.Order.replace(':id', id)}>Заказ №{data.data.count}</Breadcrumb>
					<Breadcrumb to={AppRoutes.EditOrder} active>
						Редактирование
					</Breadcrumb>
				</Breadcrumbs>
			</Stack>

			<Stack direction={'row'} mt={2} alignItems={'center'} spacing={3}>
				<Typography>
					Заказ от{' '}
					<Typography fontWeight={'bold'} component={'span'}>
						{dayjs(data.data.dateOfIssue * 1000).format(DateFormat)}
					</Typography>
				</Typography>

				<Controller
					control={control}
					name={'urgent'}
					render={({ field }) => (
						<Checkbox id={field.name} value={field.value} onChange={field.onChange} label='Срочный' />
					)}
				/>
			</Stack>

			<Stack direction={'row'} spacing={2} alignItems={'center'} mt={1} mb={1}>
				<Typography>Изготовить до:</Typography>

				<FormControl>
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
							/>
						)}
					/>
				</FormControl>
			</Stack>
			<FormProvider {...methods}>
				<EditTable />
			</FormProvider>

			<Controller
				control={control}
				name={'notes'}
				render={({ field }) => <TextField {...field} multiline rows={4} label='Примечание' sx={{ mt: 2 }} />}
			/>

			<Stack direction={'row'} spacing={2} mt={2} justifyContent={'center'}>
				<Button onClick={cancelHandler} variant='outlined' color='inherit' fullWidth sx={{ maxWidth: 260 }}>
					Отмена
				</Button>

				<Confirm
					onClick={deleteHandler}
					confirmText='Вы действительно хотите удалить заказ?'
					fullWidth
					width='260px'
					buttonComponent={
						<Button variant='outlined' color='error' fullWidth>
							Удалить
						</Button>
					}
				/>

				<Button type='submit' variant='outlined' fullWidth sx={{ maxWidth: 260 }}>
					Сохранить
				</Button>
			</Stack>
		</Stack>
	)
}
