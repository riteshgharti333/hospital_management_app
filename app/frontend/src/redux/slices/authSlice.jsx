import { createSlice } from "@reduxjs/toolkit";
import {
  loginAsyncUser,
  registerAsyncUser,
  logoutAsyncUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  refreshAccessToken 
} from "../asyncThunks/authThunks";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  profile: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginAsyncUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginAsyncUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginAsyncUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
      // register
      .addCase(registerAsyncUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerAsyncUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(registerAsyncUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
      // logout
      .addCase(logoutAsyncUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
      });

    // Add to builder
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload?.data;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload?.data;
        state.profile = action.payload?.data;
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      });
  },
});

export default authSlice.reducer;
