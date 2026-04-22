import axiosInstance from "../../utils/axiosInstance";

export const createPrescriptionAPI = (data) => axiosInstance.post("/prescription", data);

// Normal prescription list
export const getAllPrescriptionsAPI = (cursor = null, limit = 50) =>
  axiosInstance.get("/prescription", {
    params: {
      cursor: cursor ? encodeURIComponent(cursor) : undefined,
      limit,
    },
  });

// Filter prescription list
export const filterPrescriptionsAPI = (filters) =>
  axiosInstance.get("/prescription/filter", {
    params: filters,
  });

export const getPrescriptionByIdAPI = (id) => 
  axiosInstance.get(`/prescription/${id}`);

export const updatePrescriptionAPI = (id, data) =>
  axiosInstance.put(`/prescription/${id}`, data);

export const deletePrescriptionAPI = (id) => 
  axiosInstance.delete(`/prescription/${id}`);

export const searchPrescriptionsAPI = (searchTerm) =>
  axiosInstance.get(`/prescription/search`, {
    params: { query: searchTerm },
  });

// Get prescriptions by admission ID
export const getPrescriptionsByAdmissionIdAPI = (admissionId) =>
  axiosInstance.get(`/prescription/admission/${admissionId}`);

// Upload prescription document
export const uploadPrescriptionDocAPI = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.post("/prescription/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};