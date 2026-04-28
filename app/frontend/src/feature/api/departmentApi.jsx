import axiosInstance from "../../utils/axiosInstance";

// CREATE
export const createDepartmentAPI = (data) =>
  axiosInstance.post("/department", data);

// GET ALL (paginated)
export const getAllDepartmentsAPI = (cursor, limit) =>
  axiosInstance.get("/department", {
    params: {
      cursor: cursor ? encodeURIComponent(cursor) : undefined,
      limit,
    },
  });

// FILTER
export const filterDepartmentAPI = (filters) =>
  axiosInstance.get("/department/filter", {
    params: filters,
  });

// SEARCH
export const searchDepartmentAPI = (searchTerm) =>
  axiosInstance.get("/department/search", {
    params: { query: searchTerm },
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