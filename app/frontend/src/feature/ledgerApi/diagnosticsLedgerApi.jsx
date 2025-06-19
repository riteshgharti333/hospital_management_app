import axiosInstance from "../../utils/axiosInstance";

export const createDiagnosticsLedgerEntryAPI = (data) =>
  axiosInstance.post("/ledger/diagnostics-ledger/", data);

export const getAllDiagnosticsLedgerEntriesAPI = () =>
  axiosInstance.get("/ledger/diagnostics-ledger/");

export const getDiagnosticsLedgerEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/diagnostics-ledger/${id}`);

export const getDiagnosticsTotalRecordAPI = () =>
  axiosInstance.get("/ledger/diagnostics-ledger/total");

export const updateDiagnosticsLedgerEntryAPI = (id, data) =>
  axiosInstance.patch(`/ledger/diagnostics-ledger/${id}`, data);

export const deleteDiagnosticsLedgerEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/diagnostics-ledger/${id}`);
