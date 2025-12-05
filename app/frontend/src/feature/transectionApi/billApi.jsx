import axiosInstance from "../../utils/axiosInstance";

export const createBillAPI = (data) =>
  axiosInstance.post("/transection/bill/", data);

export const getAllBillsAPI = (cursor, limit = 50) =>
  axiosInstance.get("/transection/bill", { params: { cursor, limit } });

export const getBillByIdAPI = (id) =>
  axiosInstance.get(`/transection/bill/${id}`);

export const updateBillAPI = (id, data) =>
  axiosInstance.patch(`/transection/bill/${id}`, data);

export const deleteBillAPI = (id) =>
  axiosInstance.delete(`/transection/bill/${id}`);

export const searchBillsAPI = (searchTerm) =>
  axiosInstance.get(`/transection/bill/search`, {
    params: { query: searchTerm },
  });

export const filterBillsAPI = (filters) =>
  axiosInstance.get(`/transection/bill/filter`, {
    params: filters,
  });
