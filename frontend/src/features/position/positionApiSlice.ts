import { apiSlice } from '@/app/apiSlice'

export const positionApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({}),
})
