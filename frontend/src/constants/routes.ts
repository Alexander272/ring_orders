export const AppRoutes = {
	Home: '/' as const,
	Auth: '/auth' as const,
	NewOrder: '/order/new' as const,
	Order: '/order/:id' as const,
	EditOrder: '/order/edit/:id' as const,
}
