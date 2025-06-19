import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_KEY || "http://localhost:3000/api/v1",
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
