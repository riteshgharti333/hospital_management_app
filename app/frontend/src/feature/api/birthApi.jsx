import axiosInstance from "../../utils/axiosInstance";

export const createBirthRecordAPI = (data) => axiosInstance.post("/birth", data);

// Normal birth records list
export const getAllBirthRecordsAPI = (cursor, limit) =>
  axiosInstance.get("/birth", {
    params: {
      cursor: cursor ? encodeURIComponent(cursor) : undefined,
      limit,
    },
  });

// Filter birth records
export const filterBirthRecordsAPI = (filters) =>
  axiosInstance.get("/birth/filter", {
    params: filters,
  });

export const getBirthRecordByIdAPI = (id) => axiosInstance.get(`/birth/${id}`);

export const updateBirthRecordAPI = (id, data) =>
  axiosInstance.put(`/birth/${id}`, data);

export const deleteBirthRecordAPI = (id) => axiosInstance.delete(`/birth/${id}`);

export const searchBirthRecordsAPI = (searchTerm) =>
  axiosInstance.get(`/birth/search`, {
    params: { query: searchTerm },
  });