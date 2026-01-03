import axiosInstance from "../../utils/axiosInstance";

export const createDoctorLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/doctor-ledger/", data);

export const getAllDoctorLedgerEntriesAPI = (cursor, limit) =>
  axiosInstance.get("/ledger/doctor-ledger", {
    params: { cursor, limit },
  });

export const getDoctorLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/doctor-ledger/${id}`);

export const getDoctorBalanceAPI = () =>
  axiosInstance.get("/ledger/doctor-ledger/balance");

export const updateDoctorLedgerEntryAPI = (id, data) =>
  axiosInstance.put(`/ledger/doctor-ledger/${id}`, data);

export const deleteDoctorLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/doctor-ledger/${id}`);

export const searchDoctorLedgerAPI = (searchTerm) =>
  axiosInstance.get("/ledger/doctor-ledger/search", {
    params: { query: searchTerm },
  });

export const filterDoctorLedgerAPI = (filters) =>
  axiosInstance.get("/ledger/doctor-ledger/filter", {
    params: filters,
  });
