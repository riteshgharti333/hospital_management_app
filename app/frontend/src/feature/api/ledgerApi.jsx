import axiosInstance from "../../utils/axiosInstance";

export const createLedgerAPI = (data) => axiosInstance.post("/ledger", data);

// Normal ledger entries
export const getAllLedgersAPI = (cursor) =>
  axiosInstance.get("/ledger", {
    params: {
      cursor: cursor || undefined,
    },
  });

// Get ledgers by entity type
export const getLedgersByEntityAPI = (entityType, cursor) =>
  axiosInstance.get(`/ledger/${entityType}`, {
    params: {
      cursor: cursor || undefined,
    },
  });

// Search ledger by entity
export const searchLedgerByEntityAPI = (entityType, searchTerm, cursor) =>
  axiosInstance.get(`/ledger/${entityType}/search`, {
    params: {
      query: searchTerm,
      cursor: cursor || undefined,
    },
  });

// Filter ledger by entity
export const filterLedgerAPI = (entityType, filters, cursor) =>
  axiosInstance.get(`/ledger/${entityType}/filter`, {
    params: {
      ...filters,
      cursor: cursor || undefined,
    },
  });

export const getLedgerByIdAPI = (id) => axiosInstance.get(`/ledger/${id}`);



export const updateLedgerAPI = (id, data) =>
  axiosInstance.put(`/ledger/${id}`, data);

export const deleteLedgerAPI = (id) => axiosInstance.delete(`/ledger/${id}`);
