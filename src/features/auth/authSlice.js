import {createSlice} from "@reduxjs/toolkit";

const initialToken = window.localStorage.getItem("token");
const initialUser = window.localStorage.getItem("userName");
const initialEmail = window.localStorage.getItem("userEmail");

const authSlice = createSlice({
    name: "auth",
    initialState: {
        userName: initialUser || null,
        token: initialToken || null,
        userEmail: initialEmail || null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const {userName, accessToken, userEmail} = action.payload || {};
            state.userName = userName ?? null;
            state.token = accessToken ?? null;
            state.userEmail = userEmail ?? null;
            if (accessToken) window.localStorage.setItem("token", accessToken);
            if (userName) window.localStorage.setItem("userName", userName);
            if (userEmail) window.localStorage.setItem("userEmail", userEmail);
        },
        logOut: (state) => {
            state.userName = null;
            state.token = null;
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("userName");
            window.localStorage.removeItem("userEmail");
            window.sessionStorage.removeItem("permissions");
            window.sessionStorage.removeItem("userConfig");
        },
    },
});

export const {setCredentials, logOut} = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (s) => s.auth.userName;
export const selectCurrentToken = (s) => s.auth.token;
export const selectCurrentEmail = (s) => s.auth.userEmail;
