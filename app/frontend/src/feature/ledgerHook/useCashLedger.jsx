import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCashLedgerEntryAPI,
  getAllCashLedgerEntriesAPI,
  getCashLedgerEntryByIdAPI,
  getCashBalanceAPI,
  updateCashLedgerEntryAPI,
  deleteCashLedgerEntryAPI,
} from "../ledgerApi/cashLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetCashLedgerEntries = () => {
  return useQuery({
    queryKey: ["cashLedgerEntries"],
    queryFn: async () => {
      const { data } = await getAllCashLedgerEntriesAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data || [],
  });
};

export const useGetCashLedgerEntryById = (id) => {
  return useQuery({
    queryKey: ["cashLedgerEntry", id],
    queryFn: async () => {
      const { data } = await getCashLedgerEntryByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetCashBalance = () => {
  return useQuery({
    queryKey: ["cashBalance"],
    queryFn: async () => {
      const { data } = await getCashBalanceAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data ?? 0,
  });
};

export const useCreateCashLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCashLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Cash ledger entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["cashLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateCashLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCashLedgerEntryAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Cash ledger entry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cashLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteCashLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCashLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Cash ledger entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["cashLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
