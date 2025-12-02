import axiosInstance from "../../utils/axiosInstance";

export const createDoctorAPI = (data) => axiosInstance.post("/doctor", data);

// Normal doctor list
export const getAllDoctorsAPI = (cursor, limit) =>
  axiosInstance.get("/doctor", {
    params: { cursor, limit },
  });

// Filter doctor list
export const filterDoctorAPI = (filters) =>
  axiosInstance.get("/doctor/filter", {
    params: filters,
  });

export const getDoctorByIdAPI = (id) => axiosInstance.get(`/doctor/${id}`);

export const updateDoctorAPI = (id, data) =>
  axiosInstance.patch(`/doctor/${id}`, data);

export const deleteDoctorAPI = (id) => axiosInstance.delete(`/doctor/${id}`);
