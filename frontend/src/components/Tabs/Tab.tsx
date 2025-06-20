import { styled, Tab as MTab, TabProps } from '@mui/material'

// interface StyledTabProps {
// 	label: string
// 	value: string
// }

export const Tab = styled((props: TabProps) => <MTab disableRipple {...props} />)(({ theme }) => ({
	textTransform: 'none',
	fontWeight: theme.typography.fontWeightRegular,
	fontSize: theme.typography.pxToRem(15),
	marginRight: theme.spacing(1),
	color: '#000',
	borderRadius: 12,
	transition: 'all .3s ease-in-out',

	'&:hover': {
		background: '#ecdbff',
	},

	'&.Mui-selected': {
		color: '#2e28d7',
	},
	'&.Mui-focusVisible': {
		backgroundColor: 'rgba(100, 95, 228, 0.32)',
	},
}))
