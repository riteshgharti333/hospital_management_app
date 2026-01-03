import axiosInstance from "../../utils/axiosInstance";

export const createAppointmentAPI = (data) =>
  axiosInstance.post("/appointment", data);

// Normal list
export const getAllAppointmentsAPI = (cursor, limit) =>
  axiosInstance.get("/appointment", {
    params: { cursor, limit },
  });

// Filtered list
export const filterAppointmentAPI = (filters) =>
  axiosInstance.get("/appointment/filter", {
    params: filters,
  });

export const getAppointmentByIdAPI = (id) =>
  axiosInstance.get(`/appointment/${id}`);

export const updateAppointmentAPI = (id, data) =>
  axiosInstance.put(`/appointment/${id}`, data);

export const deleteAppointmentAPI = (id) =>
  axiosInstance.delete(`/appointment/${id}`);

export const searchAppointmentAPI = (searchTerm) =>
  axiosInstance.get(`/appointment/search`, {
    params: { query: searchTerm },
  });

