import axiosInstance from "../../utils/axiosInstance";

export const createVoucherAPI = (data) =>
  axiosInstance.post("/transection/voucher", data);

export const getAllVouchersAPI = () =>
  axiosInstance.get("/transection/voucher");

export const getVoucherByIdAPI = (id) =>
  axiosInstance.get(`/transection/voucher/${id}`);

export const updateVoucherAPI = (id, data) =>
  axiosInstance.patch(`/transection/voucher/${id}`, data);

export const deleteVoucherAPI = (id) =>
  axiosInstance.delete(`/transection/voucher/${id}`);
