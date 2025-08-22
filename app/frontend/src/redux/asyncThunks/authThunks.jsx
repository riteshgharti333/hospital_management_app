import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  changePassword,
  getProfile,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  updateProfile,
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

// REGISTER ASYNC THUNK
export const registerAsyncUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Failed to register:", error);
      return rejectWithValue(error.response.data || "Failed to register");
    }
  }
);

// LOGOUT ASYNC THUNK
export const logoutAsyncUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutUser();
      // Remove user info from local storage
      localStorage.removeItem("user");
      return response.data;
    } catch (error) {
      console.error("Failed to log out:", error);
      return rejectWithValue(error.response.data || "Failed to log out");
    }
  }
);


// GET PROFILE THUNK
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProfile();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

// UPDATE PROFILE THUNK
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await updateProfile(userData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile");
    }
  }
);

// CHANGE PASSWORD THUNK
export const updateUserPassword = createAsyncThunk(
  "auth/updateUserPassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const res = await changePassword(passwords);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to change password");
    }
  }
);

// REFRESH TOKEN (auto-used later)
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      await refreshToken(); // token stored in cookie
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Refresh token failed");
    }
  }
);
