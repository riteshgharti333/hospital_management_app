import axiosInstance from "../../utils/axiosInstance";

export const createNurseRecordAPI = (data) => axiosInstance.post("/nurse", data);

// Normal nurse records list
export const getAllNurseRecordsAPI = (cursor, limit) =>
  axiosInstance.get("/nurse", {
    params: {
      cursor: cursor ? encodeURIComponent(cursor) : undefined,
      limit,
    },
  });

// Filter nurse records
export const filterNurseRecordsAPI = (filters) =>
  axiosInstance.get("/nurse/filter", {
    params: filters,
  });

export const getNurseRecordByIdAPI = (id) => axiosInstance.get(`/nurse/${id}`);

export const updateNurseRecordAPI = (id, data) =>
  axiosInstance.put(`/nurse/${id}`, data);

export const deleteNurseRecordAPI = (id) => axiosInstance.delete(`/nurse/${id}`);

export const searchNurseRecordsAPI = (searchTerm) =>
  axiosInstance.get(`/nurse/search`, {
    params: { query: searchTerm },
  });