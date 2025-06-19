import axiosInstance from "../../utils/axiosInstance";

export const createPharmacistAPI = (data) =>
  axiosInstance.post("/pharmacist", data);

export const getAllPharmacistsAPI = () =>
  axiosInstance.get("/pharmacist");

export const getPharmacistByIdAPI = (id) =>
  axiosInstance.get(`/pharmacist/${id}`);

export const updatePharmacistAPI = (id, data) =>
  axiosInstance.patch(`/pharmacist/${id}`, data);

export const deletePharmacistAPI = (id) =>
  axiosInstance.delete(`/pharmacist/${id}`);
