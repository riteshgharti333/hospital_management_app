import axiosInstance from "../../utils/axiosInstance";

export const createPatientLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/patient-ledger/", data);

export const getAllPatientLedgerEntriesAPI = (cursor, limit) =>
  axiosInstance.get("/ledger/patient-ledger", {
    params: { cursor, limit },
  });

export const getPatientLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/patient-ledger/${id}`);

export const getPatientBalanceAPI = () =>
  axiosInstance.get("/ledger/patient-ledger/balance");

export const updatePatientLedgerEntryAPI = (id, data) =>
  axiosInstance.put(`/ledger/patient-ledger/${id}`, data);

export const deletePatientLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/patient-ledger/${id}`);

export const searchPatientLedgerAPI = (searchTerm) =>
  axiosInstance.get("/ledger/patient-ledger/search", {
    params: { query: searchTerm },
  });

export const filterPatientLedgerAPI = (filters) =>
  axiosInstance.get("/ledger/patient-ledger/filter", {
    params: filters,
  });
