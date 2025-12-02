import axiosInstance from "../../utils/axiosInstance";

export const createPrescriptionAPI = (data) =>
  axiosInstance.post("/prescription", data);

// Normal list
export const getAllPrescriptionsAPI = (cursor, limit) =>
  axiosInstance.get("/prescription", {
    params: { cursor, limit },
  });

// Filter list
export const filterPrescriptionAPI = (filters) =>
  axiosInstance.get("/prescription/filter", {
    params: filters,
  });
export const getPrescriptionByIdAPI = (id) =>
  axiosInstance.get(`/prescription/${id}`);

export const updatePrescriptionAPI = (id, data) =>
  axiosInstance.patch(`/prescription/${id}`, data);

export const deletePrescriptionAPI = (id) =>
  axiosInstance.delete(`/prescription/${id}`);
