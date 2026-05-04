import axiosInstance from "../../utils/axiosInstance";

export const createPrescriptionAPI = (data) => axiosInstance.post("/prescription", data);


// Normal prescription list
export const getAllPrescriptionsAPI = (cursor) =>
  axiosInstance.get("/prescription", {
    params: {
      cursor: cursor || undefined,
    },
  });

// Search prescriptions
export const searchPrescriptionsAPI = (searchTerm, cursor) =>
  axiosInstance.get(`/prescription/search`, {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

// Filter prescriptions
export const filterPrescriptionsAPI = (filters, cursor) =>
  axiosInstance.get("/prescription/filter", {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });
export const getPrescriptionByIdAPI = (id) => 
  axiosInstance.get(`/prescription/${id}`);

export const updatePrescriptionAPI = (id, data) =>
  axiosInstance.put(`/prescription/${id}`, data);

export const deletePrescriptionAPI = (id) => 
  axiosInstance.delete(`/prescription/${id}`);



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