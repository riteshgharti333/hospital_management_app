import axiosInstance from "../../utils/axiosInstance";

export const createBillAPI = (data) =>
  axiosInstance.post("/transection/bill/", data);

export const getAllBillsAPI = () =>
  axiosInstance.get("/transection/bill/");

export const getBillByIdAPI = (id) =>
  axiosInstance.get(`/transection/bill/${id}`);

export const updateBillAPI = (id, data) =>
  axiosInstance.patch(`/transection/bill/${id}`, data);

export const deleteBillAPI = (id) =>
  axiosInstance.delete(`/transection/bill/${id}`);
