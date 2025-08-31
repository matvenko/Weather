import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userName: null,
    token: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { userName, accessToken } = action.payload;
      state.userName = userName;
      state.token = accessToken;
      window.localStorage.setItem("token", accessToken);
      window.localStorage.setItem("userName", userName);
      document.cookie = `token=${accessToken}; Secure; HttpOnly`;
    },
    setAuthUser: (state, action) => {
      const { user } = action.payload;
      state.userName = user.userName;
    },
    logOut: (state, action) => {
      state.userName = null;
      state.token = null;
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, setAuthUser, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.userName;
export const selectCurrentToken = (state) => state.auth.token;
