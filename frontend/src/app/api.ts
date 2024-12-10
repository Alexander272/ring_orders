export const API = {
	auth: {
		signIn: `auth/sign-in` as const,
		refresh: `auth/refresh` as const,
		signOut: `auth/sign-out` as const,
	},
	orders: {
		base: `orders` as const,
		important: `orders/important` as const,
	},
	positions: {
		base: `positions` as const,
		several: `positions/several` as const,
		made: `positions/made` as const,
		accept: `positions/accepted` as const,
	},
}
