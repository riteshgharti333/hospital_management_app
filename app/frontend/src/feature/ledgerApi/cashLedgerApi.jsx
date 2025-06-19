import axiosInstance from "../../utils/axiosInstance";

export const createCashLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/cash-ledger/", data);

export const getAllCashLedgerEntriesAPI = () =>
  axiosInstance.get("/ledger/cash-ledger/");

export const getCashLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/cash-ledger/${id}`);

export const getCashBalanceAPI = () =>
  axiosInstance.get("/ledger/cash-ledger/balance");

export const updateCashLedgerEntryAPI = (id, data) =>
  axiosInstance.patch(`/ledger/cash-ledger/${id}`, data);

export const deleteCashLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/cash-ledger/${id}`);
