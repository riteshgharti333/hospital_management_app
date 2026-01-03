import axiosInstance from "../../utils/axiosInstance";

export const createNurseAPI = (data) => axiosInstance.post("/nurse", data);

// Normal paginated list
export const getAllNursesAPI = (cursor, limit) =>
  axiosInstance.get("/nurse", {
    params: { cursor, limit },
  });

// Filter list
export const filterNurseAPI = (filters) =>
  axiosInstance.get("/nurse/filter", {
    params: filters,
  });

export const getNurseByIdAPI = (id) => axiosInstance.get(`/nurse/${id}`);

export const updateNurseAPI = (id, data) =>
  axiosInstance.put(`/nurse/${id}`, data);

export const deleteNurseAPI = (id) => axiosInstance.delete(`/nurse/${id}`);

export const searchNurseAPI = (searchTerm) =>
  axiosInstance.get(`/nurse/search`, {
    params: { query: searchTerm },
  });
