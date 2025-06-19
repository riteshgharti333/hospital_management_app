import axiosInstance from "../../utils/axiosInstance";

export const createDoctorLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/doctor-ledger/", data);

export const getAllDoctorLedgerEntriesAPI = () =>
  axiosInstance.get("/ledger/doctor-ledger/");

export const getDoctorLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/doctor-ledger/${id}`);

export const getDoctorBalanceAPI = () =>
  axiosInstance.get("/ledger/doctor-ledger/balance");

export const updateDoctorLedgerEntryAPI = (id, data) =>
  axiosInstance.patch(`/ledger/doctor-ledger/${id}`, data);

export const deleteDoctorLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/doctor-ledger/${id}`);
