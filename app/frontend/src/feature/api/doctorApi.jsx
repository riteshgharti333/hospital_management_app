import axiosInstance from "../../utils/axiosInstance";

export const createDoctorAPI = (data) => axiosInstance.post("/doctor", data);

// getAllDoctorsAPI (already has cursor)
export const getAllDoctorsAPI = async (cursor) => {
  const response = await axiosInstance.get("/doctor", {
    params: {
      cursor: cursor || undefined,
    },
  });
  return response;
};

// Filter doctor list with cursor support
export const filterDoctorAPI = (filters, cursor) =>
  axiosInstance.get("/doctor/filter", {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });

// Search doctor with cursor support
export const searchDoctorAPI = (searchTerm, cursor) =>
  axiosInstance.get(`/doctor/search`, {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

export const getDoctorByIdAPI = (id) => axiosInstance.get(`/doctor/${id}`);

export const updateDoctorAPI = (id, data) =>
  axiosInstance.put(`/doctor/${id}`, data);

export const deleteDoctorAPI = (id) => axiosInstance.delete(`/doctor/${id}`);
