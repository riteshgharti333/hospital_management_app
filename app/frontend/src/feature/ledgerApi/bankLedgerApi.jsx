import axiosInstance from "../../utils/axiosInstance";

export const createBankLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/bank-ledger/", data);

export const getAllBankLedgerEntriesAPI = (cursor, limit) =>
  axiosInstance.get("/ledger/bank-ledger", {
    params: { cursor, limit },
  });

export const getBankLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/bank-ledger/${id}`);

export const getBankBalanceAPI = () =>
  axiosInstance.get("/ledger/bank-ledger/balance");

export const updateBankLedgerEntryAPI = (id, data) =>
  axiosInstance.put(`/ledger/bank-ledger/${id}`, data);

export const deleteBankLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/bank-ledger/${id}`);

export const searchBankLedgerAPI = (searchTerm) =>
  axiosInstance.get("/ledger/bank-ledger/search", {
    params: { query: searchTerm },
  });

export const filterBankLedgerAPI = (filters) =>
  axiosInstance.get("/ledger/bank-ledger/filter", {
    params: filters,
  });
