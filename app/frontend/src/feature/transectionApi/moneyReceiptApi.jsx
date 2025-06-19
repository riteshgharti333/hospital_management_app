import axiosInstance from "../../utils/axiosInstance";

export const createMoneyReceiptAPI = (data) =>
  axiosInstance.post("/transection/money-receipt/", data);

export const getAllMoneyReceiptsAPI = () =>
  axiosInstance.get("/transection/money-receipt/");

export const getMoneyReceiptByIdAPI = (id) =>
  axiosInstance.get(`/transection/money-receipt/${id}`);

export const updateMoneyReceiptAPI = (id, data) =>
  axiosInstance.patch(`/transection/money-receipt/${id}`, data);

export const deleteMoneyReceiptAPI = (id) =>
  axiosInstance.delete(`/transection/money-receipt/${id}`);
