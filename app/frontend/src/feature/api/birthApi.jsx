import axiosInstance from "../../utils/axiosInstance";

export const createBirthRecordAPI = (data) =>
  axiosInstance.post("/birth", data);

export const getAllBirthRecordsAPI = () => axiosInstance.get("/birth");

export const getBirthRecordByIdAPI = (id) => axiosInstance.get(`/birth/${id}`);

export const updateBirthRecordAPI = (id, data) =>
  axiosInstance.put(`/birth/${id}`, data);

export const deleteBirthRecordAPI = (id) =>
  axiosInstance.delete(`/birth/${id}`);
