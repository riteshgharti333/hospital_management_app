import axiosInstance from "../../utils/axiosInstance";

export const createBankLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/bank-ledger/", data);

export const getAllBankLedgerEntriesAPI = () =>
  axiosInstance.get("/ledger/bank-ledger/");

export const getBankLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/bank-ledger/${id}`);

export const getBankBalanceAPI = () =>
  axiosInstance.get("/ledger/bank-ledger/balance");

export const updateBankLedgerEntryAPI = (id, data) =>
  axiosInstance.patch(`/ledger/bank-ledger/${id}`, data);

export const deleteBankLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/bank-ledger/${id}`);
