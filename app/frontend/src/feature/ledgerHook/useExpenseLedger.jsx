import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExpenseEntryAPI,
  getAllExpenseEntriesAPI,
  getExpenseEntryByIdAPI,
  getExpenseSummaryAPI,
  updateExpenseEntryAPI,
  deleteExpenseEntryAPI,
} from "../ledgerApi/expenseLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetExpenseEntries = () => {
  return useQuery({
    queryKey: ["expenseLedgerEntries"],
    queryFn: async () => {
      const { data } = await getAllExpenseEntriesAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data || [],
  });
};

export const useGetExpenseEntryById = (id) => {
  return useQuery({
    queryKey: ["expenseLedgerEntry", id],
    queryFn: async () => {
      const { data } = await getExpenseEntryByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetExpenseSummary = () => {
  return useQuery({
    queryKey: ["expenseSummary"],
    queryFn: async () => {
      const { data } = await getExpenseSummaryAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data ?? {},
  });
};

export const useCreateExpenseEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpenseEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Expense entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["expenseLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateExpenseEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateExpenseEntryAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Expense entry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["expenseLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteExpenseEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpenseEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Expense entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["expenseLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
