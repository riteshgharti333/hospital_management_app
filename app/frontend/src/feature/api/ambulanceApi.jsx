import axiosInstance from "../../utils/axiosInstance";

export const createAmbulanceAPI = (data) =>
  axiosInstance.post("/ambulance", data);

export const getAllAmbulancesAPI = () =>
  axiosInstance.get("/ambulance");

export const getAmbulanceByIdAPI = (id) =>
  axiosInstance.get(`/ambulance/${id}`);

export const updateAmbulanceAPI = (id, data) =>
  axiosInstance.patch(`/ambulance/${id}`, data);

export const deleteAmbulanceAPI = (id) =>
  axiosInstance.delete(`/ambulance/${id}`);
