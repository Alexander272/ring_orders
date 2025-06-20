import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'
import type { IPosition } from './types/position'
import { IContextMenu } from '../table/types/table'

interface IPositionSlice {
	selected: { [x: string]: IPosition }
	contextMenu?: IContextMenu
}

const initialState: IPositionSlice = {
	selected: {},
}

const positionSlice = createSlice({
	name: 'position',
	initialState,
	reducers: {
		setSelected: (state, action: PayloadAction<IPosition[] | IPosition>) => {
			if (Array.isArray(action.payload))
				state.selected = action.payload.reduce((a, v) => ({ ...a, [v.id]: v }), {})
			else {
				if (state.selected[action.payload.id]) delete state.selected[action.payload.id]
				else state.selected[action.payload.id] = action.payload
			}
		},
		setContextMenu: (state, action: PayloadAction<IContextMenu | undefined>) => {
			state.contextMenu = action.payload
		},

		resetPositions: () => initialState,
	},
})

export const positionPath = positionSlice.name
export const positionReducer = positionSlice.reducer

export const getSelected = (state: RootState) => state.position.selected
export const getContextMenu = (state: RootState) => state.position.contextMenu

export const { setSelected, setContextMenu, resetPositions } = positionSlice.actions
