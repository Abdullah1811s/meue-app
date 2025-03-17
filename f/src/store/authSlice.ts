import { createSlice } from "@reduxjs/toolkit";

// Check if UserToken or VendorToken exists in localStorage
const userToken = localStorage.getItem("UserToken");
const vendorToken = localStorage.getItem("VendorToken");

interface AuthState {
  isUserAuthenticated: boolean;
  isVendorAuthenticated: boolean;
}

const initialState: AuthState = {
  // Set isUserAuthenticated to true if UserToken exists, otherwise false
  isUserAuthenticated: !!userToken,
  // Set isVendorAuthenticated to true if VendorToken exists, otherwise false
  isVendorAuthenticated: !!vendorToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action for user login
    userLogin: (state) => {
      state.isUserAuthenticated = true;
    },
    // Action for vendor login
    vendorLogin: (state) => {
      state.isVendorAuthenticated = true;
    },
    // Action for user logout
    userLogout: (state) => {
      state.isUserAuthenticated = false;
    },
    // Action for vendor logout
    vendorLogout: (state) => {
      state.isVendorAuthenticated = false;
    },
    // Action for global logout (both user and vendor)
    logout: (state) => {
      state.isUserAuthenticated = false;
      state.isVendorAuthenticated = false;
    },
  },
});

export const { userLogin, vendorLogin, userLogout, vendorLogout, logout } = authSlice.actions;
export default authSlice.reducer;