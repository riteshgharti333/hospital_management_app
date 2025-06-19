import axiosInstance from "../../utils/axiosInstance";

export const createProductAPI = (data) =>
  axiosInstance.post("/product/", data);

export const getAllProductsAPI = () =>
  axiosInstance.get("/product/");

export const getProductByIdAPI = (id) =>
  axiosInstance.get(`/product/${id}`);

export const updateProductAPI = (id, data) =>
  axiosInstance.patch(`/product/${id}`, data);

export const deleteProductAPI = (id) =>
  axiosInstance.delete(`/product/${id}`);
