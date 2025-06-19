import axiosInstance from "../../utils/axiosInstance";

export const createDoctorAPI = (data) =>
  axiosInstance.post("/doctor", data);

export const getAllDoctorsAPI = () =>
  axiosInstance.get("/doctor");

export const getDoctorByIdAPI = (id) =>
  axiosInstance.get(`/doctor/${id}`);

export const updateDoctorAPI = (id, data) =>
  axiosInstance.patch(`/doctor/${id}`, data);

export const deleteDoctorAPI = (id) =>
  axiosInstance.delete(`/doctor/${id}`);
