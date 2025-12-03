import axiosInstance from "../../utils/axiosInstance";

export const createDepartmentAPI = (data) =>
  axiosInstance.post("/department/", data);

export const filterDepartmentAPI = (filters) =>
  axiosInstance.get("/department/filter", {
    params: filters,
  });

export const getAllDepartmentsAPI = (cursor, limit) =>
  axiosInstance.get("/department", {
    params: { cursor, limit },
  });

export const getDepartmentByIdAPI = (id) =>
  axiosInstance.get(`/department/${id}`);

export const getDepartmentByNameAPI = (name) =>
  axiosInstance.get(`/department/name/${name}`);

export const updateDepartmentAPI = (id, data) =>
  axiosInstance.put(`/department/${id}`, data);

export const deleteDepartmentAPI = (id) =>
  axiosInstance.delete(`/department/${id}`);

export const searchDepartmentAPI = (searchTerm) =>
  axiosInstance.get(`/department/search`, {
    params: { query: searchTerm },
  });
