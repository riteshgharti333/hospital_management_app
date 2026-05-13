import axios from "axios";
import { store } from "../redux/store";
import {
  refreshTokenThunk,
  logoutAsyncUser,
} from "../redux/asyncThunks/authThunks";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_KEY ||
    "http://localhost:3000/api/v1",

  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 🔥 Handle expired access token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Refresh token request
        await store.dispatch(refreshTokenThunk()).unwrap();

        // Retry failed request
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Refresh failed → logout
        store.dispatch(logoutAsyncUser());

        return Promise.reject(refreshError);
      }
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unexpected error occurred";

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;