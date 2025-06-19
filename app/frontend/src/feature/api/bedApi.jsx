import axiosInstance from "../../utils/axiosInstance";

export const createBedRecordAPI = (data) =>
  axiosInstance.post("/bed", data);

export const getAllBedRecordsAPI = () =>
  axiosInstance.get("/bed");

export const getBedRecordByIdAPI = (id) =>
  axiosInstance.get(`/bed/${id}`);

export const updateBedRecordAPI = (id, data) =>
  axiosInstance.put(`/bed/${id}`, data);

export const deleteBedRecordAPI = (id) =>
  axiosInstance.delete(`/bed/${id}`);
