import axiosInstance from "../../utils/axiosInstance";

export const createAdmissionAPI = (data) =>
  axiosInstance.post("/admission/", data);

export const getAllAdmissionAPI = (cursor, limit = 50) => 
  axiosInstance.get("/admission/", { params: { cursor, limit } });

export const getAdmissionByIdAPI = (id) =>
  axiosInstance.get(`/admission/${id}`);

export const getAdmissionByNameAPI = (name) =>
  axiosInstance.get(`/admission/name/${name}`);

export const updateAdmissionAPI = (id, data) =>
  axiosInstance.put(`/admission/${id}`, data);

export const deleteAdmissionAPI = (id) =>
  axiosInstance.delete(`/admission/${id}`);


export const searchAdmissionAPI = (searchTerm) =>
  axiosInstance.get(`/admission/search`, {
    params: { query: searchTerm },
  });

  export const filterAdmissionsAPI = (filters) =>
  axiosInstance.get("/admission/filter", {
    params: filters, // { fromDate, toDate, patientSex, bloodGroup, cursor, limit }
  });