import axiosInstance from "../../utils/axiosInstance";

export const createPatientLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/patient-ledger/", data);

export const getAllPatientLedgerEntriesAPI = () =>
  axiosInstance.get("/ledger/patient-ledger/");

export const getPatientLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/patient-ledger/${id}`);

export const getPatientBalanceAPI = () =>
  axiosInstance.get("/ledger/patient-ledger/balance");

export const updatePatientLedgerEntryAPI = (id, data) =>
  axiosInstance.patch(`/ledger/patient-ledger/${id}`, data);

export const deletePatientLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/patient-ledger/${id}`);
