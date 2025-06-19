import axiosInstance from "../../utils/axiosInstance";

export const createSupplierLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/supplier-ledger/", data);

export const getAllSupplierLedgerEntriesAPI = () =>
  axiosInstance.get("/ledger/supplier-ledger/");

export const getSupplierLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/supplier-ledger/${id}`);

export const getSupplierOutstandingBalanceAPI = () =>
  axiosInstance.get("/ledger/supplier-ledger/outstanding");

export const getSupplierSummaryReportAPI = () =>
  axiosInstance.get("/ledger/supplier-ledger/summary");

export const updateSupplierLedgerEntryAPI = (id, data) =>
  axiosInstance.patch(`/ledger/supplier-ledger/${id}`, data);

export const deleteSupplierLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/supplier-ledger/${id}`);
