import axiosInstance from "../../utils/axiosInstance";

export const createAdmissionAPI = (data) =>
  axiosInstance.post("/admission/", data);


// Updated Admission API
export const getAllAdmissionAPI = async (cursor) => {
  const response = await axiosInstance.get("/admission/", {
    params: {
      cursor: cursor || undefined,
    },
  });
  return response;
};

export const searchAdmissionAPI = (searchTerm, cursor) =>
  axiosInstance.get(`/admission/search`, {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

export const filterAdmissionsAPI = (filters, cursor) =>
  axiosInstance.get("/admission/filter", {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });

export const getAdmissionByIdAPI = (id) =>
  axiosInstance.get(`/admission/${id}`);

export const getAdmissionByNameAPI = (name) =>
  axiosInstance.get(`/admission/name/${name}`);

export const updateAdmissionAPI = (id, data) =>
  axiosInstance.put(`/admission/${id}`, data);

export const deleteAdmissionAPI = (id) =>
  axiosInstance.delete(`/admission/${id}`);
