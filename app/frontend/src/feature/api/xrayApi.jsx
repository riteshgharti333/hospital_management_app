import axiosInstance from "../../utils/axiosInstance";

export const createXrayReportAPI = (data) =>
  axiosInstance.post("/xray/", data);

export const getAllXrayReportsAPI = () =>
  axiosInstance.get("/xray/");

export const getXrayReportByIdAPI = (id) =>
  axiosInstance.get(`/xray/${id}`);

export const getXrayFinancialSummaryAPI = () =>
  axiosInstance.get("/xray/summary/financial");

export const getXrayDoctorWiseSummaryAPI = () =>
  axiosInstance.get("/xray/summary/doctor-wise");

export const updateXrayReportAPI = (id, data) =>
  axiosInstance.patch(`/xray/${id}`, data);

export const deleteXrayReportAPI = (id) =>
  axiosInstance.delete(`/xray/${id}`);
