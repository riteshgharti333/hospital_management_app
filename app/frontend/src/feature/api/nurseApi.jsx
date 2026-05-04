import axiosInstance from "../../utils/axiosInstance";

export const createNurseRecordAPI = (data) => axiosInstance.post("/nurse", data);


// Normal nurse records list
export const getAllNurseRecordsAPI = (cursor) =>
  axiosInstance.get("/nurse", {
    params: {
      cursor: cursor || undefined,
    },
  });

// Search nurse records
export const searchNurseRecordsAPI = (searchTerm, cursor) =>
  axiosInstance.get(`/nurse/search`, {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

// Filter nurse records
export const filterNurseRecordsAPI = (filters, cursor) =>
  axiosInstance.get("/nurse/filter", {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });

export const getNurseRecordByIdAPI = (id) => axiosInstance.get(`/nurse/${id}`);

export const updateNurseRecordAPI = (id, data) =>
  axiosInstance.put(`/nurse/${id}`, data);

export const deleteNurseRecordAPI = (id) => axiosInstance.delete(`/nurse/${id}`);
