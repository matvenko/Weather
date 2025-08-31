import { apiSlice } from "../../app/api/apiSlice.js";

export const brandsApiSlice = apiSlice.injectEndpoints({
  tagTypes: ["brands"],
  endpoints: (build) => ({
    getBrands: build.query({
      query: () => {
        return {
          url: `/brand`,
        };
      },
      transformResponse: (response) => ({
        responseBrands: response,
      }),
      providesTags: ["brands"],
    }),
    addBrand: build.mutation({
      query: (newBrandData) => ({
        url: "/brand",
        method: "POST",
        body: newBrandData,
      }),
      invalidatesTags: ["brands"],
    }),
    changeBrand: build.mutation({
      query: (companyData) => ({
        url: "/brand",
        method: "PUT",
        body: companyData,
      }),
      invalidatesTags: ["brands"],
    }),
    deleteBrand: build.mutation({
      query: (body) => ({
        url: "/brand",
        method: "DELETE",
        body: { ...body },
      }),
      invalidatesTags: ["brands"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useAddBrandMutation,
  useChangeBrandMutation,
  useDeleteBrandMutation,
} = brandsApiSlice;
