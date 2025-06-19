import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBankLedgerEntryAPI,
  getAllBankLedgerEntriesAPI,
  getBankLedgerEntryByIdAPI,
  getBankBalanceAPI,
  updateBankLedgerEntryAPI,
  deleteBankLedgerEntryAPI,
} from "../ledgerApi/bankLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetBankLedgerEntries = () => {
  return useQuery({
    queryKey: ["bankLedgerEntries"],
    queryFn: async () => {
      const { data } = await getAllBankLedgerEntriesAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data || [],
  });
};

export const useGetBankLedgerEntryById = (id) => {
  return useQuery({
    queryKey: ["bankLedgerEntry", id],
    queryFn: async () => {
      const { data } = await getBankLedgerEntryByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetBankBalance = () => {
  return useQuery({
    queryKey: ["bankBalance"],
    queryFn: async () => {
      const { data } = await getBankBalanceAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data ?? 0,
  });
};

export const useCreateBankLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBankLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Ledger entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["bankLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateBankLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBankLedgerEntryAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Ledger entry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["bankLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteBankLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBankLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Ledger entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["bankLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
