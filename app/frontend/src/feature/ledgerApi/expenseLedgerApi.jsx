import axiosInstance from "../../utils/axiosInstance";

export const createExpenseEntryAPI = (data) =>
  axiosInstance.post("/ledger/expense-ledger/", data);

export const getAllExpenseEntriesAPI = () =>
  axiosInstance.get("/ledger/expense-ledger/");

export const getExpenseEntryByIdAPI = (id) =>
  axiosInstance.get(`/ledger/expense-ledger/${id}`);

export const getExpenseSummaryAPI = () =>
  axiosInstance.get("/ledger/expense-ledger/summary");

export const updateExpenseEntryAPI = (id, data) =>
  axiosInstance.patch(`/ledger/expense-ledger/${id}`, data);

export const deleteExpenseEntryAPI = (id) =>
  axiosInstance.delete(`/ledger/expense-ledger/${id}`);
