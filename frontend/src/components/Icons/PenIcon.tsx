import { FC } from 'react'
import { SvgIcon, SxProps, Theme } from '@mui/material'

export const PenIcon: FC<SxProps<Theme>> = style => {
	return (
		<SvgIcon sx={style}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 117.74 122.88'
				enableBackground='new 0 0 117.74 122.88'
				xmlSpace='preserve'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M94.62 2C93.16.64 91.48-.09 89.6.01c-1.88 0-3.56.73-4.92 2.2L73.59 13.72l31.07 30.03 11.19-11.72c1.36-1.36 1.88-3.14 1.88-5.02s-.73-3.66-2.09-4.92L94.62 2zM41.44 109.58c-4.08 1.36-8.26 2.62-12.35 3.98-4.08 1.36-8.16 2.72-12.35 4.08-9.73 3.14-15.07 4.92-16.22 5.23-1.15.31-.42-4.18 1.99-13.6l7.74-29.61.64-.66 30.56 30.56-.01.02zM22.2 67.25l42.99-44.82 31.07 29.92L52.75 97.8 22.2 67.25z'
				/>
			</svg>
		</SvgIcon>
	)
}
