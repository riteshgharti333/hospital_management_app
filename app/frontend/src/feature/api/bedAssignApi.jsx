import axiosInstance from "../../utils/axiosInstance";

export const createBedAssignmentAPI = (data) =>
  axiosInstance.post("/bed-assign", data);

export const getAllBedAssignmentsAPI = () =>
  axiosInstance.get("/bed-assign");

export const getBedAssignmentByIdAPI = (id) =>
  axiosInstance.get(`/bed-assign/${id}`);

export const updateBedAssignmentAPI = (id, data) =>
  axiosInstance.put(`/bed-assign/${id}`, data);

export const deleteBedAssignmentAPI = (id) =>
  axiosInstance.delete(`/bed-assign/${id}`);

export const dischargePatientAPI = (id) =>
  axiosInstance.post(`/bed-assign/${id}/discharge`);
