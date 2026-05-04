import axiosInstance from "../../utils/axiosInstance";

export const createBillAPI = (data) =>
  axiosInstance.post("/transection/bill/", data);

// Normal bills list
export const getAllBillsAPI = (cursor) =>
  axiosInstance.get("/transection/bill", {
    params: {
      cursor: cursor || undefined,
    },
  });

// Search bills
export const searchBillsAPI = (searchTerm, cursor) =>
  axiosInstance.get(`/transection/bill/search`, {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

// Filter bills
export const filterBillsAPI = (filters, cursor) =>
  axiosInstance.get(`/transection/bill/filter`, {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });

export const getBillByIdAPI = (id) =>
  axiosInstance.get(`/transection/bill/${id}`);

export const updateBillAPI = (id, data) =>
  axiosInstance.put(`/transection/bill/${id}`, data);

export const deleteBillAPI = (id) =>
  axiosInstance.delete(`/transection/bill/${id}`);
