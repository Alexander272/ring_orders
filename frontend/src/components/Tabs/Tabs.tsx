import { styled, Tabs as MTabs, TabsProps } from '@mui/material'

// interface StyledTabsProps {
// 	children?: React.ReactNode
// 	value: string
// 	onChange: (event: React.SyntheticEvent, newValue: string) => void
// }

export const Tabs = styled((props: TabsProps) => (
	<MTabs {...props} TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }} />
))({
	// background: '#deefff75',
	// borderRadius: 12,
	borderBottom: '1px solid #dfdfdf',

	'& .MuiTabs-indicator': {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	'& .MuiTabs-indicatorSpan': {
		maxWidth: 40,
		width: '100%',
		backgroundColor: '#635ee7',
	},
})
