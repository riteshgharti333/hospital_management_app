import axiosInstance from "../../utils/axiosInstance";

export const createPatientRecordAPI = (data) =>
  axiosInstance.post("/patient", data);

export const getAllPatientsAPI = (cursor, limit) =>
  axiosInstance.get("/patient", {
    params: { cursor, limit },
  });

export const filterPatientAPI = (filters) =>
  axiosInstance.get("/patient/filter", {
    params: filters,
  });

export const getPatientRecordByIdAPI = (id) =>
  axiosInstance.get(`/patient/${id}`);

export const updatePatientRecordAPI = (id, data) =>
  axiosInstance.put(`/patient/${id}`, data);

export const deletePatientRecordAPI = (id) =>
  axiosInstance.delete(`/patient/${id}`);

export const searchPatientAPI = (searchTerm) =>
  axiosInstance.get(`/patient/search`, {
    params: { query: searchTerm },
  });
