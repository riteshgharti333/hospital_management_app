import axiosInstance from "../../utils/axiosInstance";

export const createMoneyReceiptAPI = (data) =>
  axiosInstance.post("/transection/money-receipt/", data);

export const getAllMoneyReceiptsAPI = (cursor, limit = 50) =>
  axiosInstance.get("transection/money-receipt/", {
    params: { cursor, limit },
  });

export const getMoneyReceiptByIdAPI = (id) =>
  axiosInstance.get(`/transection/money-receipt/${id}`);

export const updateMoneyReceiptAPI = (id, data) =>
  axiosInstance.put(`/transection/money-receipt/${id}`, data);

export const deleteMoneyReceiptAPI = (id) =>
  axiosInstance.delete(`/transection/money-receipt/${id}`);

// SEARCH
export const searchMoneyReceiptAPI = (searchTerm) =>
  axiosInstance.get("/transection/money-receipt/search", {
    params: { query: searchTerm },
  });

// FILTER
export const filterMoneyReceiptAPI = (filters) =>
  axiosInstance.get("/transection/money-receipt/filter", {
    params: filters,
  });
