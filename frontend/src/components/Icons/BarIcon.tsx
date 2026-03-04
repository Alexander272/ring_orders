import { FC } from 'react'
import { SvgIcon, SxProps, Theme } from '@mui/material'

type Props = {
	fill?: string
	sx?: SxProps<Theme>
}

export const BarIcon: FC<Props> = ({ fill = '#000', sx }) => {
	return (
		<SvgIcon sx={sx}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke={fill}
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			>
				<line x1='18' y1='20' x2='18' y2='10'></line>
				<line x1='12' y1='20' x2='12' y2='4'></line>
				<line x1='6' y1='20' x2='6' y2='14'></line>
			</svg>
		</SvgIcon>
	)
}
