import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createStaffAccess,
  getProfileApi,
  getUsersApi,
  loginUser,
  logoutApi,
  toggleStaffAccess,
  updateProfileApi,
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
  "admin/createAccess",
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
  "admin/toggleAccess",
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
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to send OTP");
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
      return rejectWithValue(err.response?.data || "OTP verification failed");
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
      return rejectWithValue(err.response?.data || "Password reset failed");
    }
  }
);


// GET PROFILE
export const getUserProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getProfileApi();
      return data.data; // because your sendResponse wraps data in data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
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
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);


// LOGOUT
export const logoutAsyncUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
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
      // backend returns { data: { ...payload } }
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);


