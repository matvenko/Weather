import { apiSlice } from "../../app/api/apiSlice.js";

export const authApiSlice = apiSlice.injectEndpoints({
  tagTypes: ["Auth"],
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["Auth"],
    }),
    authUser: build.mutation({
      query: (body) => ({
        url: "/admin/get_user_info",
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useAuthUserMutation } = authApiSlice;
