import axiosInstance from "../../utils/axiosInstance";

export const createLedgerAPI = (data) => axiosInstance.post("/ledger", data);

export const getAllLedgersAPI = (cursor, limit) =>
  axiosInstance.get("/ledger", {
    params: {
      cursor: cursor ? encodeURIComponent(cursor) : undefined,
      limit,
    },
  });


  // API function - entityType is now part of the URL path
export const filterLedgerAPI = (entityType, filters) =>
  axiosInstance.get(`/ledger/${entityType}/filter`, {
    params: filters,
  });

export const getLedgerByIdAPI = (id) => axiosInstance.get(`/ledger/${id}`);

export const getLedgersByEntityAPI = (entityType) =>
  axiosInstance.get(`/ledger/entity/${entityType}`);

export const updateLedgerAPI = (id, data) =>
  axiosInstance.put(`/ledger/${id}`, data);

export const deleteLedgerAPI = (id) => axiosInstance.delete(`/ledger/${id}`);

export const searchLedgerByEntityAPI = (entityType, searchTerm) =>
  axiosInstance.get(`/ledger/${entityType}/search`, {
    params: { query: searchTerm },
  });
