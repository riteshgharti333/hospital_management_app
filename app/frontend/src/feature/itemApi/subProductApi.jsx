import axiosInstance from "../../utils/axiosInstance";

export const createProductEntryAPI = (data) =>
  axiosInstance.post("/product-entry/", data);

export const getAllProductEntriesAPI = () =>
  axiosInstance.get("/product-entry/");

export const getProductEntryByIdAPI = (id) =>
  axiosInstance.get(`/product-entry/${id}`);

export const updateProductEntryAPI = (id, data) =>
  axiosInstance.patch(`/product-entry/${id}`, data);

export const deleteProductEntryAPI = (id) =>
  axiosInstance.delete(`/product-entry/${id}`);
