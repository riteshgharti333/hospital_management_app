import axiosInstance from "../../utils/axiosInstance";

export const createCashLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/cash-ledger/", data);

export const getAllCashLedgerEntriesAPI = (cursor, limit) =>
  axiosInstance.get("/ledger/cash-ledger", {
    params: { cursor, limit },
  });

export const getCashLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/cash-ledger/${id}`);

export const getCashBalanceAPI = () =>
  axiosInstance.get("/ledger/cash-ledger/balance");

export const updateCashLedgerEntryAPI = (id, data) =>
  axiosInstance.put(`/ledger/cash-ledger/${id}`, data);

export const deleteCashLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/cash-ledger/${id}`);

export const searchCashLedgerAPI = (searchTerm) =>
  axiosInstance.get("/ledger/cash-ledger/search", {
    params: { query: searchTerm },
  });

export const filterCashLedgerAPI = (filters) =>
  axiosInstance.get("/ledger/cash-ledger/filter", {
    params: filters,
  });
