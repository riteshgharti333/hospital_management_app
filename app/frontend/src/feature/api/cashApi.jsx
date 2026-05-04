import axiosInstance from "../../utils/axiosInstance";

export const createCashAPI = (data) => axiosInstance.post("/cash", data);


// Normal cash list
export const getAllCashAPI = (cursor) =>
  axiosInstance.get("/cash", {
    params: {
      cursor: cursor || undefined,
    },
  });

// Search cash accounts
export const searchCashAPI = (searchTerm, cursor) =>
  axiosInstance.get(`/cash/search`, {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

// Filter cash accounts
export const filterCashAPI = (filters, cursor) =>
  axiosInstance.get("/cash/filter", {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });

export const getCashByIdAPI = (id) => axiosInstance.get(`/cash/${id}`);

export const updateCashAPI = (id, data) =>
  axiosInstance.put(`/cash/${id}`, data);

export const deleteCashAPI = (id) => axiosInstance.delete(`/cash/${id}`);
