import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCashLedgerEntryAPI,
  getAllCashLedgerEntriesAPI,
  getCashLedgerEntryByIdAPI,
  getCashBalanceAPI,
  updateCashLedgerEntryAPI,
  deleteCashLedgerEntryAPI,
  filterCashLedgerAPI,
  searchCashLedgerAPI,
} from "../ledgerApi/cashLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetCashLedgerEntries = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["cashLedgerEntries", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllCashLedgerEntriesAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
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
      toast.success(
        response?.data?.message || "Cash ledger entry created successfully"
      );
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
      toast.success(
        response?.data?.message || "Cash ledger entry updated successfully"
      );
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
      toast.success(
        response?.data?.message || "Cash ledger entry deleted successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["cashLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useSearchCashLedger = (searchTerm) => {
  return useQuery({
    queryKey: ["cash-ledger-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchCashLedgerAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useFilterCashLedger = (filters) => {
  return useQuery({
    queryKey: ["cash-ledger-filter", filters],
    queryFn: async () => {
      const { data } = await filterCashLedgerAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
