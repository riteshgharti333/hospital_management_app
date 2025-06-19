import axiosInstance from "../../utils/axiosInstance";

export const createAdmissionAPI = (data) =>
  axiosInstance.post("/admission/", data);

export const getAllAdmissionAPI = () => axiosInstance.get("/admission/");

export const getAdmissionByIdAPI = (id) =>
  axiosInstance.get(`/admission/${id}`);

export const getAdmissionByNameAPI = (name) =>
  axiosInstance.get(`/admission/name/${name}`);

export const updateAdmissionAPI = (id, data) =>
  axiosInstance.put(`/admission/${id}`, data);

export const deleteAdmissionAPI = (id) =>
  axiosInstance.delete(`/admission/${id}`);
