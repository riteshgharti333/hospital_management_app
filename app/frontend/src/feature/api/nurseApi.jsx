import axiosInstance from "../../utils/axiosInstance";

export const createNurseAPI = (data) =>
  axiosInstance.post("/nurse", data);

export const getAllNursesAPI = () =>
  axiosInstance.get("/nurse");

export const getNurseByIdAPI = (id) =>
  axiosInstance.get(`/nurse/${id}`);

export const updateNurseAPI = (id, data) =>
  axiosInstance.patch(`/nurse/${id}`, data);

export const deleteNurseAPI = (id) =>
  axiosInstance.delete(`/nurse/${id}`);
