import { FC, useRef, useState } from 'react'
import { Button, ButtonGroup, Menu, MenuItem, useTheme } from '@mui/material'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import type { IFetchError } from '@/app/types/error'
import type { IEditOrderDTO, IOrder } from '../../types/order'
import { PermRules } from '@/constants/permissions'
import { useAppDispatch } from '@/hooks/redux'
import { useCheckPermission } from '@/features/auth/hooks/check'
import { changeDialogIsOpen, DialogVariants } from '@/features/dialog/dialogSlice'
import { Confirm } from '@/components/Confirm/Confirm'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { PlusIcon } from '@/components/Icons/PlusIcon'
import { LeftArrowIcon } from '@/components/Icons/LeftArrowIcon'
import { CheckIcon } from '@/components/Icons/CheckIcon'
import { useUpdateOrderMutation } from '../../orderApiSlice'

type Props = {
	data: IOrder
	isDone?: boolean
	isSent?: boolean
	isAccepted?: boolean
}

export const Buttons: FC<Props> = ({ data, isDone, isSent, isAccepted }) => {
	const { palette } = useTheme()
	const [open, setOpen] = useState(false)
	const anchor = useRef<HTMLDivElement>(null)

	const canOrderWrite = useCheckPermission(PermRules.Orders.Write)
	const canMade = useCheckPermission(PermRules.Made.Write)
	const canAccepted = useCheckPermission(PermRules.Accept.Write)

	const dispatch = useAppDispatch()

	const [update, { isLoading }] = useUpdateOrderMutation()

	const toggleHandler = () => setOpen(prev => !prev)

	const statusHandler = async () => {
		if (data?.status != 'new') return

		const newData: IEditOrderDTO = {
			...data,
			hasChanged: true,
			status: 'processing',
			dateOfAdoption: dayjs().unix(),
		}
		try {
			await update(newData).unwrap()
			toast.success('Заказ принят в работу')
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	const closeOrderHandler = async () => {
		if (!data) return

		const newData: IEditOrderDTO = { ...data, hasChanged: true, status: 'closed', closingDate: dayjs().unix() }
		try {
			await update(newData).unwrap()
			toast.success('Заказ закрыт')
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	const openDefaultHandler = () => {
		// если доступно, и то, и другое, открываться будет только последняя форма
		if (canAccepted)
			dispatch(changeDialogIsOpen({ variant: 'Accept', isOpen: true, content: { id: data?.id || '' } }))
		if (canMade) dispatch(changeDialogIsOpen({ variant: 'Made', isOpen: true, content: { id: data?.id || '' } }))
	}

	const openHandler = (variant: DialogVariants, isDefect?: boolean) => () => {
		toggleHandler()
		dispatch(changeDialogIsOpen({ variant, isOpen: true, content: { id: data?.id || '', isDefect } }))
	}

	return (
		<>
			{isLoading && <TopFallback />}

			{!canOrderWrite && data.status == 'new' ? (
				<Button
					onClick={statusHandler}
					variant='outlined'
					disabled={isLoading}
					sx={{ width: 200, padding: '6px 12px', textTransform: 'inherit' }}
				>
					Принять в работу
				</Button>
			) : null}

			{data.status == 'processing' && (canMade || (canAccepted && !isAccepted)) ? (
				<>
					<ButtonGroup ref={anchor}>
						<Button
							onClick={openDefaultHandler}
							disabled={(canMade && isDone) || (canAccepted && isAccepted)}
							variant='outlined'
							sx={{ width: 200, padding: '6px 12px', textTransform: 'inherit' }}
						>
							<PlusIcon
								fontSize={12}
								mr={1}
								fill={
									(canMade && isDone) || (canAccepted && isAccepted)
										? palette.action.disabled
										: palette.primary.main
								}
							/>
							Добавить
						</Button>
						{canMade && (
							<Button variant='outlined' onClick={toggleHandler}>
								<LeftArrowIcon fontSize={12} fill={palette.primary.main} transform={'rotate(-90deg)'} />
							</Button>
						)}
					</ButtonGroup>

					<Menu
						open={open}
						onClose={toggleHandler}
						anchorEl={anchor.current}
						transformOrigin={{ horizontal: 'right', vertical: 'top' }}
						anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
						MenuListProps={{
							role: 'listbox',
							disableListWrap: true,
						}}
						slotProps={{
							paper: {
								elevation: 0,
								sx: {
									overflow: 'visible',
									filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
								},
							},
						}}
					>
						<MenuItem selected disabled={isDone} onClick={openHandler('Made')}>
							<CheckIcon fontSize={14} mr={1} fill={palette.primary.main} />
							Изготовление
						</MenuItem>
						<MenuItem onClick={openHandler('Made', true)} sx={{ pl: '38px' }}>
							Изготовление
							<br />
							(Взамен брака)
						</MenuItem>
						<MenuItem disabled={isSent} onClick={openHandler('Sent')} sx={{ pl: '38px' }}>
							Отправление
						</MenuItem>
						{canAccepted && (
							<MenuItem onClick={openHandler('Accept')} sx={{ pl: '38px' }}>
								Принятие
							</MenuItem>
						)}
					</Menu>
				</>
			) : null}

			{canOrderWrite && isAccepted && data.status != 'closed' ? (
				<Confirm
					confirmTitle='Закрытие заказа'
					iconColor='#ebcb31'
					buttonColor='primary'
					confirmText={'Вы действительно хотите закрыть заказ?'}
					onClick={closeOrderHandler}
					buttonComponent={
						<Button
							// onClick={closeOrderHandler}
							variant='outlined'
							sx={{ width: 200, padding: '6px 12px', textTransform: 'inherit' }}
						>
							Закрыть заказ
						</Button>
					}
				/>
			) : null}
		</>
	)
}
