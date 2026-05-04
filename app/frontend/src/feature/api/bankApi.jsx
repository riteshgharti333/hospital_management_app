import axiosInstance from "../../utils/axiosInstance";

export const createBankAPI = (data) => axiosInstance.post("/bank", data);

// Normal bank list
export const getAllBanksAPI = (cursor) =>
  axiosInstance.get("/bank", {
    params: {
      cursor: cursor || undefined,
    },
  });

// Search banks
export const searchBankAPI = (searchTerm, cursor) =>
  axiosInstance.get(`/bank/search`, {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

// Filter banks
export const filterBankAPI = (filters, cursor) =>
  axiosInstance.get("/bank/filter", {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });

export const getBankByIdAPI = (id) => axiosInstance.get(`/bank/${id}`);

export const updateBankAPI = (id, data) =>
  axiosInstance.put(`/bank/${id}`, data);

export const deleteBankAPI = (id) => axiosInstance.delete(`/bank/${id}`);
