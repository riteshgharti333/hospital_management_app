import axiosInstance from "../../utils/axiosInstance";

export const createPatientRecordAPI = (data) =>
  axiosInstance.post("/patient", data);

export const getAllPatientRecordsAPI = () => axiosInstance.get("/patient");

export const getPatientRecordByIdAPI = (id) =>
  axiosInstance.get(`/patient/${id}`);

export const updatePatientRecordAPI = (id, data) =>
  axiosInstance.put(`/patient/${id}`, data);

export const deletePatientRecordAPI = (id) => 
  axiosInstance.delete(`/patient/${id}`);
