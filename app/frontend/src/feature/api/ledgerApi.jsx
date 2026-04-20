import axiosInstance from "../../utils/axiosInstance";

export const createLedgerAPI = (data) => axiosInstance.post("/ledger", data);

export const getAllLedgersAPI = (cursor, limit) =>
  axiosInstance.get("/ledger", {
    params: {
      cursor: cursor ? encodeURIComponent(cursor) : undefined,
      limit,
    },
  });

export const filterLedgerAPI = (filters) =>
  axiosInstance.get("/ledger/filter", {
    params: filters,
  });

export const getLedgerByIdAPI = (id) => axiosInstance.get(`/ledger/${id}`);

export const getLedgersByEntityAPI = (entityType) =>
  axiosInstance.get(`/ledger/${entityType}`);

export const updateLedgerAPI = (id, data) =>
  axiosInstance.put(`/ledger/${id}`, data);

export const deleteLedgerAPI = (id) => axiosInstance.delete(`/ledger/${id}`);

export const searchLedgerAPI = (searchTerm) =>
  axiosInstance.get(`/ledger/search`, {
    params: { query: searchTerm },
  });