// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createStaffAccessThunk,
  forgotPasswordThunk,
  getUserProfile,
  loginAsyncUser,
  logoutAsyncUser,
  resetPasswordThunk,
  toggleStaffAccessThunk,
  updateUserProfile,
  verifyOtpThunk,
  getUsers,
  refreshTokenThunk,
  changePasswordThunk,
} from "../asyncThunks/authThunks";

const initialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  profile: null,
  status: "idle",
  error: null,
  // pagination + 'all' bucket
  page: 1,
  limit: 25,
  all: {
    users: [],
    total: 0,
  },
  // grouped buckets
  admin: { count: 0, users: [] },
  doctor: { count: 0, users: [] },
  nurse: { count: 0, users: [] },
  // top-level totals
  totalUsers: 0,
  activeAccess: 0,
  deniedAccess: 0,
  // other flags used in your slice
  loading: false,
  lastAction: null,
  otpVerified: false,
  resetUserId: null,
  resetToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // LOGIN
    builder
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

    // CREATE STAFF ACCESS
    builder
      .addCase(createStaffAccessThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStaffAccessThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = action.payload;
      })
      .addCase(createStaffAccessThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // TOGGLE STAFF ACCESS
    builder
      .addCase(toggleStaffAccessThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleStaffAccessThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = action.payload;
      })
      .addCase(toggleStaffAccessThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FORGOT PASSWORD
    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // VERIFY OTP
    builder
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.resetToken = action.payload.data.resetToken;
      })

      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // RESET PASSWORD
    builder
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = false;
        state.resetToken = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.error = action.payload;
      });

    // GET PROFILE
    builder
      .addCase(getUserProfile.pending, (state) => {
        if (state.status === "idle") {
          state.status = "loading";
        }
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    // UPDATE PROFILE
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // LOGOUT
    builder
      .addCase(logoutAsyncUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
      })

      .addCase(logoutAsyncUser.rejected, (state) => {
        state.user = null;
        localStorage.removeItem("user");
      });

    // GET USERS (new aggregated payload)
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        const payload = action.payload || {};

        // pagination meta
        state.page = payload.page ?? state.page;
        state.limit = payload.limit ?? state.limit;

        // all (paginated)
        state.all = {
          users: payload.all?.users ?? [],
          total: payload.all?.total ?? 0,
        };

        // grouped buckets
        state.admin = payload.admin ?? { count: 0, users: [] };
        state.doctor = payload.doctor ?? { count: 0, users: [] };
        state.nurse = payload.nurse ?? { count: 0, users: [] };

        // totals
        state.totalUsers = payload.totalUsers ?? state.all.total ?? 0;
        state.activeAccess = payload.activeAccess ?? 0;
        state.deniedAccess = payload.deniedAccess ?? 0;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      });

    // REFRESH TOKEN
    builder
      .addCase(refreshTokenThunk.pending, (state) => {
        state.status = "refreshing";
      })
      .addCase(refreshTokenThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      });

    // CHANGE PASSWORD
    builder
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.lastAction = "PASSWORD_CHANGED";
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
