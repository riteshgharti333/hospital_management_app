import axios from "axios";

const baseUrl = import.meta.env.VITE_API_KEY;

// LOGIN USER
export const loginUser = (userData) => {
  return axios.post(`${baseUrl}/auth/login`, userData, {
    withCredentials: true,
  });
};

// REGISTER USER
export const registerUser = (userData) => {
  return axios.post(`${baseUrl}/auth/register`, userData, {
    withCredentials: true,
  });
};

// LOGOUT USER
export const logoutUser = () => {
  return axios.post(`${baseUrl}/auth/logout`, null, {
    withCredentials: true, 
  });
};


// GET PROFILE
export const getProfile = () => {
  return axios.get(`${baseUrl}/auth/profile`, { withCredentials: true });
};

// UPDATE PROFILE
export const updateProfile = (userData) => {
  return axios.put(`${baseUrl}/auth/update-profile`, userData, {
    withCredentials: true,
  });
};

// CHANGE PASSWORD
export const changePassword = (passwords) => {
  return axios.put(`${baseUrl}/auth/change-password`, passwords, {
    withCredentials: true,
  });
};

// REFRESH TOKEN
export const refreshToken = () => {
  return axios.post(`${baseUrl}/auth/refresh-token`, {}, { withCredentials: true });
};
