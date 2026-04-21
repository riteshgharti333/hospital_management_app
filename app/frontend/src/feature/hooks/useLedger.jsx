import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLedgerAPI,
  deleteLedgerAPI,
  getAllLedgersAPI,
  getLedgerByIdAPI,
  getLedgersByEntityAPI,
  updateLedgerAPI,
  filterLedgerAPI,
  searchLedgerByEntityAPI, // Import the API function, not the hook
} from "../api/ledgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Normal ledger entries
export const useGetLedgers = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["ledger", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllLedgersAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: false,
    staleTime: 0,
    retry: 1,
  });
};

// Filter ledger entries hook
// Filter ledger entries hook
export const useFilterLedgers = (entityType, filters) => {
  return useQuery({
    queryKey: ["ledger-filter", entityType, filters],
    queryFn: async () => {
      const { data } = await filterLedgerAPI(entityType, filters);
      return {
        transactions: data?.data || [],  // data.data is the array
        pagination: data?.pagination || {},
        currentBalance: null  // Filter doesn't return currentBalance
      };
    },
    enabled: !!entityType && Object.keys(filters || {}).length > 0,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// FETCH LEDGER BY ID
export const useGetLedgerById = (id) => {
  return useQuery({
    queryKey: ["ledger", id],
    queryFn: async () => {
      const { data } = await getLedgerByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// FETCH LEDGERS BY ENTITY
export const useGetLedgersByEntity = (entityType) => {
  return useQuery({
    queryKey: ["ledger", entityType],
    queryFn: async () => {
      const { data } = await getLedgersByEntityAPI(entityType);
      return data?.data || { transactions: [], currentBalance: 0 };
    },
    enabled: !!entityType,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE LEDGER
export const useCreateLedger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLedgerAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Ledger entry created successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE LEDGER
export const useUpdateLedger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateLedgerAPI(id, data),
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Ledger entry updated successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE LEDGER
export const useDeleteLedger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLedgerAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Ledger entry deleted successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// SEARCH LEDGERS BY ENTITY (Hook definition - only once)
export const useSearchLedgersByEntity = (entityType, searchTerm) => {
  return useQuery({
    queryKey: ["ledger-search", entityType, searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      const { data } = await searchLedgerByEntityAPI(entityType, searchTerm);
      return data?.data || [];
    },
    enabled: !!entityType && !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};