import axiosInstance from "../../utils/axiosInstance";

export const createPatientRecordAPI = (data) =>
  axiosInstance.post("/patient", data);

export const getAllPatientsAPI = (cursor) =>
  axiosInstance.get("/patient", {
    params: {
      cursor: cursor || undefined,
    },
  });

export const searchPatientAPI = (searchTerm, cursor) =>
  axiosInstance.get(`/patient/search`, {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

export const filterPatientAPI = (filters, cursor) =>
  axiosInstance.get("/patient/filter", {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });

export const getPatientRecordByIdAPI = (id) =>
  axiosInstance.get(`/patient/${id}`);

export const updatePatientRecordAPI = (id, data) =>
  axiosInstance.put(`/patient/${id}`, data);

export const deletePatientRecordAPI = (id) =>
  axiosInstance.delete(`/patient/${id}`);
