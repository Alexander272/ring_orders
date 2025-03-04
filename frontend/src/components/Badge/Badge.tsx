import { Badge as MUIBadge, type BadgeProps, styled } from '@mui/material'

export const Badge = styled(MUIBadge)<BadgeProps>(({ theme }) => ({
	'& .MuiBadge-badge': {
		left: -1,
		top: -1,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: '0',
	},
}))
