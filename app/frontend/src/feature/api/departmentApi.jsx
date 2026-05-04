import axiosInstance from "../../utils/axiosInstance";

// CREATE
export const createDepartmentAPI = (data) =>
  axiosInstance.post("/department", data);

// Normal departments list
export const getAllDepartmentsAPI = (cursor) =>
  axiosInstance.get("/department", {
    params: {
      cursor: cursor || undefined,
    },
  });

// Search departments
export const searchDepartmentAPI = (searchTerm, cursor) =>
  axiosInstance.get("/department/search", {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

// Filter departments
export const filterDepartmentAPI = (filters, cursor) =>
  axiosInstance.get("/department/filter", {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });

// GET BY ID
export const getDepartmentByIdAPI = (id) =>
  axiosInstance.get(`/department/${id}`);

// UPDATE
export const updateDepartmentAPI = (id, data) =>
  axiosInstance.put(`/department/${id}`, data);

// DELETE
export const deleteDepartmentAPI = (id) =>
  axiosInstance.delete(`/department/${id}`);
