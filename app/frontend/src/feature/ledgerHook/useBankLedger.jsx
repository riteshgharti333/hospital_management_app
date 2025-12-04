import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBankLedgerEntryAPI,
  getAllBankLedgerEntriesAPI,
  getBankLedgerEntryByIdAPI,
  getBankBalanceAPI,
  updateBankLedgerEntryAPI,
  deleteBankLedgerEntryAPI,
  searchBankLedgerAPI,
  filterBankLedgerAPI,
} from "../ledgerApi/bankLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetBankLedgerEntries = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["bankLedgerEntries", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllBankLedgerEntriesAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
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
      toast.success(
        response?.data?.message || "Ledger entry created successfully"
      );
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
      toast.success(
        response?.data?.message || "Ledger entry updated successfully"
      );
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
      toast.success(
        response?.data?.message || "Ledger entry deleted successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["bankLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useSearchBankLedger = (searchTerm) => {
  return useQuery({
    queryKey: ["bank-ledger-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchBankLedgerAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useFilterBankLedger = (filters) => {
  return useQuery({
    queryKey: ["bank-ledger-filter", filters],
    queryFn: async () => {
      const { data } = await filterBankLedgerAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
