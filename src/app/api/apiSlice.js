import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut } from "../../features/auth/authSlice";
import { Modal } from "antd";
const devMode = true;

const _baseUrl = devMode
  ? "https://weather-api.webmania.ge/"
  : "https://weather-api.webmania.ge/";

const baseQuery = fetchBaseQuery({
  baseUrl: _baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    Modal.info({
      title: "თქვენ სესიას გაუვიდა ვადა",
      onOk: () => {
        api.dispatch(logOut());
        window.location = "/login";
      },
    });
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
