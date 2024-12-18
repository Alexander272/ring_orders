import { FC } from 'react'
import { SvgIcon, SxProps, Theme } from '@mui/material'

export const BellIcon: FC<SxProps<Theme>> = style => {
	return (
		<SvgIcon sx={style}>
			<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120.641 122.878' xmlSpace='preserve'>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M68.16 6.889c18.129 3.653 31.889 19.757 31.889 38.921 0 22.594-2.146 39.585 20.592 54.716H0c22.8-15.173 20.647-32.49 20.647-54.716 0-19.267 13.91-35.439 32.182-38.979 1.054-9.14 14.345-9.096 15.331.058zm8.551 102.301c-1.398 7.785-8.205 13.688-16.392 13.688s-14.992-5.902-16.393-13.688h32.785z'
				/>
			</svg>
		</SvgIcon>
	)
}
