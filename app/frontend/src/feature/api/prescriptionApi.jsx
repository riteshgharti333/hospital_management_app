import axiosInstance from "../../utils/axiosInstance";

export const createPrescriptionAPI = (data) =>
  axiosInstance.post("/prescription", data);

export const getAllPrescriptionsAPI = () =>
  axiosInstance.get("/prescription");

export const getPrescriptionByIdAPI = (id) =>
  axiosInstance.get(`/prescription/${id}`);

export const updatePrescriptionAPI = (id, data) =>
  axiosInstance.patch(`/prescription/${id}`, data);

export const deletePrescriptionAPI = (id) =>
  axiosInstance.delete(`/prescription/${id}`);
