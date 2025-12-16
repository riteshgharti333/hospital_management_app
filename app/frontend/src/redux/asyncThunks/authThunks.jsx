import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  changePasswordAPI,
  createStaffAccess,
  forgotPasswordAPI,
  getProfileApi,
  getUsersApi,
  loginUser,
  logoutApi,
  refreshTokenApi,
  resetPasswordAPI,
  toggleStaffAccess,
  updateProfileApi,
  verifyOtpAPI,
} from "../api/authAPI";

// LOGIN ASYNC THUNK
export const loginAsyncUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginUser(userData);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Failed to log in:", error);
      return rejectWithValue(error.response.data || "Failed to log in");
    }
  }
);

export const createStaffAccessThunk = createAsyncThunk(
  "admin/staff/create-access",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createStaffAccess(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create access");
    }
  }
);

export const toggleStaffAccessThunk = createAsyncThunk(
  "admin/staff/toggle-access",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await toggleStaffAccess(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to toggle access");
    }
  }
);


// STEP 1 — SEND OTP
export const forgotPasswordThunk = createAsyncThunk(
  "password/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await forgotPasswordAPI(email);
      console.log(res)
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to send OTP"
      );
    }
  }
);

// STEP 2 — VERIFY OTP
export const verifyOtpThunk = createAsyncThunk(
  "password/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await verifyOtpAPI(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// STEP 3 — RESET PASSWORD
export const resetPasswordThunk = createAsyncThunk(
  "password/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await resetPasswordAPI(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Password reset failed"
      );
    }
  }
);


// GET PROFILE
export const getUserProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getProfileApi();
      return data.data; // backend wrapper respected
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updateData, { rejectWithValue }) => {
    try {
      const { data } = await updateProfileApi(updateData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// LOGOUT
export const logoutAsyncUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await logoutApi(); // 👈 capture response
      return data; // 👈 return backend response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

export const getUsers = createAsyncThunk(
  "admin/staff",
  async (params = { page: 1, limit: 25 }, { rejectWithValue }) => {
    try {
      const { data } = await getUsersApi(params);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  "auth/refresh-token",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await refreshTokenApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Session expired");
    }
  }
);

// CHANGE PASSWORD
export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await changePasswordAPI(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to change password"
      );
    }
  }
);
