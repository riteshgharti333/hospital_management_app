import axiosInstance from "../../utils/axiosInstance";

export const createPharmacyLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/pharmacy-ledger/", data);

export const getAllPharmacyLedgerEntriesAPI = () =>
  axiosInstance.get("/ledger/pharmacy-ledger/");

export const getPharmacyLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/pharmacy-ledger/${id}`);

export const getPharmacyFinancialSummaryAPI = () =>
  axiosInstance.get("/ledger/pharmacy-ledger/summary/financial");

export const getPharmacyCategorySummaryAPI = () =>
  axiosInstance.get("/ledger/pharmacy-ledger/summary/category");

export const updatePharmacyLedgerEntryAPI = (id, data) =>
  axiosInstance.patch(`/ledger/pharmacy-ledger/${id}`, data);

export const deletePharmacyLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/pharmacy-ledger/${id}`);
