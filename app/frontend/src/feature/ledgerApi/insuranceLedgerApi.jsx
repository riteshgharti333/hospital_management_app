import axiosInstance from "../../utils/axiosInstance";

export const createInsuranceLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/insurance-ledger/", data);

export const getAllInsuranceLedgerEntriesAPI = () =>
  axiosInstance.get("/ledger/insurance-ledger/");

export const getInsuranceLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/insurance-ledger/${id}`);

export const getInsuranceSummaryAPI = () =>
  axiosInstance.get("/ledger/insurance-ledger/summary");

export const updateInsuranceLedgerEntryAPI = (id, data) =>
  axiosInstance.patch(`/ledger/insurance-ledger/${id}`, data);

export const deleteInsuranceLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/insurance-ledger/${id}`);
