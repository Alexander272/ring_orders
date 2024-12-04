import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type DialogVariants = 'Made' | 'Accept'

interface IDialogOptions {
	isOpen: boolean
	content?: unknown
}

type IDialogState = {
	[key in DialogVariants]?: IDialogOptions
}

interface IChangeDialogAction extends IDialogOptions {
	variant: DialogVariants
}

const initialState: IDialogState = {}

const dialogSlice = createSlice({
	name: 'dialog',
	initialState,
	reducers: {
		changeDialogIsOpen: (state, action: PayloadAction<IChangeDialogAction>) => {
			const { variant, isOpen, content } = action.payload
			state[variant] = { isOpen, content }
		},

		resetState: () => initialState,
	},
})

export const getDialogState = (variant: DialogVariants) => (state: RootState) => state.dialog[variant]

export const dialogPath = dialogSlice.name
export const dialogReducer = dialogSlice.reducer

export const { changeDialogIsOpen, resetState } = dialogSlice.actions