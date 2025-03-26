import { createSlice } from "@reduxjs/toolkit";

// Check if UserToken or VendorToken exists in localStorage
const userToken = localStorage.getItem("UserToken");
const vendorToken = localStorage.getItem("VendorToken");

interface AuthState {
  isUserAuthenticated: boolean;
  isVendorAuthenticated: boolean;
  isPaid: any;
}

const initialState: AuthState = {
  isUserAuthenticated: !!userToken,
  isVendorAuthenticated: !!vendorToken,
  isPaid: null, // Default false, controlled by Redux state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLogin: (state) => {
      state.isUserAuthenticated = true;
    },
    vendorLogin: (state) => {
      state.isVendorAuthenticated = true;
    },
    userLogout: (state) => {
      state.isUserAuthenticated = false;
      state.isPaid = false; // Reset on logout
    },
    vendorLogout: (state) => {
      state.isVendorAuthenticated = false;
    },
    logout: (state) => {
      state.isUserAuthenticated = false;
      state.isVendorAuthenticated = false;
      state.isPaid = false;
    },
    setUserPaid: (state, action) => {
      state.isPaid = action.payload;
    },
  },
});

export const { userLogin, vendorLogin, userLogout, vendorLogout, logout, setUserPaid } = authSlice.actions;
export default authSlice.reducer;
