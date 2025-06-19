import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  registerUser,
  updatePassword,
  updateProfile,
  userProfile,
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

// USER PROFILE ASYNC THUNK
export const userProfileAsync = createAsyncThunk(
  "auth/userProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userProfile();
      // console.log(res.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return rejectWithValue(
        error.response.data || "Failed to fetch user profile"
      );
    }
  }
);

// UPDATE PROFILE ASYNC THUNK
export const updateProfileAsync = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateProfile(profileData);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return rejectWithValue(
        error.response.data || "Failed to fetch user profile"
      );
    }
  }
);

// UPDATE PASSWORD ASYNC THUNK
export const updatePasswordAsync = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await updatePassword(passwordData);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return rejectWithValue(
        error.response.data || "Failed to fetch user profile"
      );
    }
  }
);
