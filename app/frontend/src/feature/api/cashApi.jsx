import axiosInstance from "../../utils/axiosInstance";

export const createCashAPI = (data) => axiosInstance.post("/cash", data);

// Normal cash list
export const getAllCashAPI = (cursor, limit) =>
  axiosInstance.get("/cash", {
    params: {
      cursor: cursor ? encodeURIComponent(cursor) : undefined,
      limit,
    },
  });

// Filter cash list
export const filterCashAPI = (filters) =>
  axiosInstance.get("/cash/filter", {
    params: filters,
  });

export const getCashByIdAPI = (id) => axiosInstance.get(`/cash/${id}`);

export const updateCashAPI = (id, data) =>
  axiosInstance.put(`/cash/${id}`, data);

export const deleteCashAPI = (id) => axiosInstance.delete(`/cash/${id}`);

export const searchCashAPI = (searchTerm) =>
  axiosInstance.get(`/cash/search`, {
    params: { query: searchTerm },
  });