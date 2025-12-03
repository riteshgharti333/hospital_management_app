import axiosInstance from "../../utils/axiosInstance";

export const createBirthRecordAPI = (data) =>
  axiosInstance.post("/birth", data);

export const getAllBirthRecordsAPI = (cursor, limit = 50) =>
  axiosInstance.get("/birth/", { params: { cursor, limit } });

export const getBirthRecordByIdAPI = (id) => axiosInstance.get(`/birth/${id}`);

export const updateBirthRecordAPI = (id, data) =>
  axiosInstance.put(`/birth/${id}`, data);

export const deleteBirthRecordAPI = (id) =>
  axiosInstance.delete(`/birth/${id}`);

export const filterBirthAPI = (filters) =>
  axiosInstance.get("/birth/filter", {
    params: filters,
  });

export const searchBirthAPI = (searchTerm) =>
  axiosInstance.get(`/birth/search`, {
    params: { query: searchTerm },
  });
