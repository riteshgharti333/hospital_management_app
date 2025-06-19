import axiosInstance from "../../utils/axiosInstance";

export const createAppointmentAPI = (data) =>
  axiosInstance.post("/appointment", data);

export const getAllAppointmentsAPI = () =>
  axiosInstance.get("/appointment");

export const getAppointmentByIdAPI = (id) =>
  axiosInstance.get(`/appointment/${id}`);

export const updateAppointmentAPI = (id, data) =>
  axiosInstance.patch(`/appointment/${id}`, data);

export const deleteAppointmentAPI = (id) =>
  axiosInstance.delete(`/appointment/${id}`);
