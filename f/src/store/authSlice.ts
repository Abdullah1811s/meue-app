import { createSlice } from "@reduxjs/toolkit";

// Check if the UserToken exists in localStorage (or sessionStorage)
const userToken = localStorage.getItem("UserToken");

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  // If a UserToken exists, set isAuthenticated to true, otherwise false
  isAuthenticated: userToken ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true; // Set to true when logged in
    },
    logout: (state) => {
      state.isAuthenticated = false; // Set to false when logged out
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
