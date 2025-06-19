
import axiosInstance from "../../utils/axiosInstance";

export const createDepartmentAPI = (data) =>
  axiosInstance.post("/department/", data);

export const getAllDepartmentsAPI = () =>
  axiosInstance.get("/department/");

export const getDepartmentByIdAPI = (id) =>
  axiosInstance.get(`/department/${id}`);

export const getDepartmentByNameAPI = (name) =>
  axiosInstance.get(`/department/name/${name}`);

export const updateDepartmentAPI = (id, data) =>
  axiosInstance.put(`/department/${id}`, data);

export const deleteDepartmentAPI = (id) =>
  axiosInstance.delete(`/department/${id}`);
