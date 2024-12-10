export const PermRules = Object.freeze({
	Orders: {
		Read: 'orders:read' as const,
		Write: 'orders:write' as const,
	},
	Made: {
		Read: 'made:read' as const,
		Write: 'made:write' as const,
	},
	Accept: {
		Read: 'accept:read' as const,
		Write: 'accept:write' as const,
	},
})
