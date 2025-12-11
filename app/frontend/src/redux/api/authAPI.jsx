import axios from "axios";

const baseUrl = import.meta.env.VITE_API_KEY;

export const loginUser = (data) => {
  return axios.post(`${baseUrl}/auth/login`, {
    regId: data.regId,
    password: data.password,
  }, {
    withCredentials: true,
  });
};
// CREATE ACCESS (Doctor or Nurse)
export const createStaffAccess = (data) => {
return axios.post(`${baseUrl}/admin/staff/create-access`, data, {
  withCredentials: true,
});
};

// ENABLE/DISABLE ACCESS
export const toggleStaffAccess = (data) => {
return axios.post(`${baseUrl}/admin/staff/toggle-access`, data, {
  withCredentials: true,
});
};


// STEP 1: Forgot Password → Send OTP to email
export const forgotPasswordAPI = (email) => {
  return axios.post(
    `${baseUrl}/password/forgot-password`,
    { email },
    { withCredentials: true }
  );
};

// STEP 2: Verify OTP
export const verifyOtpAPI = (data) => {
  return axios.post(
    `${baseUrl}/password/verify-otp`,
    data,
    { withCredentials: true }
  );
};

// STEP 3: Reset password after OTP verification
export const resetPasswordAPI = (data) => {
  return axios.post(
    `${baseUrl}/password/reset-password`,
    data,
    { withCredentials: true }
  );
};


export const getProfileApi = () => {
  return axios.get(`${baseUrl}/auth/profile`, { withCredentials: true });
};

export const updateProfileApi = (data) => {
  return axios.put(`${baseUrl}/auth/profile/update`, data, {
    withCredentials: true,
  });
};

export const logoutApi = () => {
  return axios.post(`${baseUrl}/auth/logout`, {}, { withCredentials: true });
}



export const getUsersApi = (params = { page: 1, limit: 25 }) => {
  return axios.get(`${baseUrl}/admin/staff`, {
    params,
    withCredentials: true,
  });
};