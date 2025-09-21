import { createSlice } from "@reduxjs/toolkit";

const initialToken = window.localStorage.getItem("token");
const initialUser = window.localStorage.getItem("userName");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userName: initialUser || null,
    token: initialToken || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { userName, accessToken } = action.payload || {};
      state.userName = userName ?? null;
      state.token = accessToken ?? null;
      if (accessToken) window.localStorage.setItem("token", accessToken);
      if (userName) window.localStorage.setItem("userName", userName);
    },
    logOut: (state) => {
      state.userName = null;
      state.token = null;
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("userName");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (s) => s.auth.userName;
export const selectCurrentToken = (s) => s.auth.token;
