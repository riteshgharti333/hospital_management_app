import axiosInstance from "../../utils/axiosInstance";

export const createBrandAPI = (data) =>
  axiosInstance.post("/brand/", data);

export const getAllBrandsAPI = () =>
  axiosInstance.get("/brand/");

export const getBrandByIdAPI = (id) =>
  axiosInstance.get(`/brand/${id}`);

export const updateBrandAPI = (id, data) =>
  axiosInstance.patch(`/brand/${id}`, data);

export const deleteBrandAPI = (id) =>
  axiosInstance.delete(`/brand/${id}`);
