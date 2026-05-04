import axiosInstance from "../../utils/axiosInstance";

export const createMoneyReceiptAPI = (data) =>
  axiosInstance.post("/transection/money-receipt/", data);


// Normal money receipts list
export const getAllMoneyReceiptsAPI = (cursor) =>
  axiosInstance.get("transection/money-receipt/", {
    params: {
      cursor: cursor || undefined,
    },
  });

// Search money receipts
export const searchMoneyReceiptAPI = (searchTerm, cursor) =>
  axiosInstance.get("/transection/money-receipt/search", {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

// Filter money receipts
export const filterMoneyReceiptAPI = (filters, cursor) =>
  axiosInstance.get("/transection/money-receipt/filter", {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });

export const getMoneyReceiptByIdAPI = (id) =>
  axiosInstance.get(`/transection/money-receipt/${id}`);

export const updateMoneyReceiptAPI = (id, data) =>
  axiosInstance.put(`/transection/money-receipt/${id}`, data);

export const deleteMoneyReceiptAPI = (id) =>
  axiosInstance.delete(`/transection/money-receipt/${id}`);


