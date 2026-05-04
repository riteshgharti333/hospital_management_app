import axiosInstance from "../../utils/axiosInstance";

export const createBirthRecordAPI = (data) => axiosInstance.post("/birth", data);


// Normal birth records list
export const getAllBirthRecordsAPI = (cursor) =>
  axiosInstance.get("/birth", {
    params: {
      cursor: cursor || undefined,
    },
  });

// Search birth records
export const searchBirthRecordsAPI = (searchTerm, cursor) =>
  axiosInstance.get(`/birth/search`, {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

// Filter birth records
export const filterBirthRecordsAPI = (filters, cursor) =>
  axiosInstance.get("/birth/filter", {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });

export const getBirthRecordByIdAPI = (id) => axiosInstance.get(`/birth/${id}`);

export const updateBirthRecordAPI = (id, data) =>
  axiosInstance.put(`/birth/${id}`, data);

export const deleteBirthRecordAPI = (id) => axiosInstance.delete(`/birth/${id}`);

