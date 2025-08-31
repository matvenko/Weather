import { apiSlice } from '../../app/api/apiSlice'

export const commonApiSlice = apiSlice.injectEndpoints({
	tagTypes: ['Common'],
	endpoints: builder => ({
		getNationalBanksCcyRates: builder.query({
			query: args => {
				return {
					url: `/common/get_ccy_rate?fromCcy=${args.fromCcy}&toCcy=${args.toCcy}`
				}
			},
			providesTags: ['Common']
		})
	})
})

export const { useGetNationalBanksCcyRatesQuery } = commonApiSlice
