import axiosInstance from "../../utils/axiosInstance";

export const createBankAPI = (data) => axiosInstance.post("/bank", data);

// Normal bank list
export const getAllBanksAPI = (cursor, limit) =>
  axiosInstance.get("/bank", {
    params: {
      cursor: cursor ? encodeURIComponent(cursor) : undefined,
      limit,
    },
  });

// Filter bank list
export const filterBankAPI = (filters) =>
  axiosInstance.get("/bank/filter", {
    params: filters,
  });

export const getBankByIdAPI = (id) => axiosInstance.get(`/bank/${id}`);

export const updateBankAPI = (id, data) =>
  axiosInstance.put(`/bank/${id}`, data);

export const deleteBankAPI = (id) => axiosInstance.delete(`/bank/${id}`);

export const searchBankAPI = (searchTerm) =>
  axiosInstance.get(`/bank/search`, {
    params: { query: searchTerm },
  });