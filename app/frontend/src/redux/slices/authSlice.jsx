import { createSlice } from "@reduxjs/toolkit";
import {
  loginAsyncUser,
  registerAsyncUser,
  logoutAsyncUser,
  userProfileAsync,
  updateProfileAsync,
  updatePasswordAsync,
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

    builder
      // profile
      .addCase(userProfileAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userProfileAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        // console.log(action.payload.profile);
      })
      .addCase(userProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
      // update profile
      .addCase(updateProfileAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedProfile = action.payload.user;
        if (state.profile) {
          state.profile.userDetails.user = updatedProfile;
        }
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
      // update password
      .addCase(updatePasswordAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePasswordAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updatePasswordAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
