export const API = {
	auth: {
		signIn: `auth/sign-in` as const,
		refresh: `auth/refresh` as const,
		signOut: `auth/sign-out` as const,
	},
	orders: {
		base: `orders` as const,
	},
	positions: {
		base: `positions` as const,
	},
}
