import { SvgIcon, SxProps, Theme } from '@mui/material'
import { FC } from 'react'

export const CloseIcon: FC<SxProps<Theme>> = style => {
	return (
		<SvgIcon sx={style}>
			<svg xmlns='http://www.w3.org/2000/svg' xmlSpace='preserve' viewBox='0 0 122.881 122.88'>
				<path d='M61.44 0c16.966 0 32.326 6.877 43.445 17.996 11.119 11.118 17.996 26.479 17.996 43.444 0 16.967-6.877 32.326-17.996 43.444-11.119 11.119-26.479 17.996-43.445 17.996s-32.326-6.877-43.444-17.996C6.877 93.766 0 78.406 0 61.439c0-16.965 6.877-32.326 17.996-43.444C29.114 6.877 44.474 0 61.44 0zm18.72 37.369a3.332 3.332 0 1 1 4.713 4.713L65.512 61.444l19.361 19.362a3.333 3.333 0 0 1-4.713 4.713L60.798 66.157 41.436 85.52a3.333 3.333 0 0 1-4.713-4.713l19.363-19.362-19.363-19.363a3.333 3.333 0 0 1 4.713-4.713l19.363 19.362L80.16 37.369zm20.012-14.661C90.26 12.796 76.566 6.666 61.44 6.666c-15.126 0-28.819 6.13-38.731 16.042C12.797 32.62 6.666 46.314 6.666 61.439c0 15.126 6.131 28.82 16.042 38.732 9.912 9.911 23.605 16.042 38.731 16.042 15.126 0 28.82-6.131 38.732-16.042 9.912-9.912 16.043-23.606 16.043-38.732.001-15.125-6.13-28.819-16.042-38.731z' />
			</svg>
		</SvgIcon>
	)
}