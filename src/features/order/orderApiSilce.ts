import { apiSlice } from '@/app/apiSlice'

export const orderApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({}),
})
