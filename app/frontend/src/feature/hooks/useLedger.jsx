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

// Get ledgers by entity with cursor pagination
export const useGetLedgersByEntity = (entityType, cursor) => {
  return useQuery({
    queryKey: ["ledger", entityType, cursor],
    queryFn: async () => {
      const { data } = await getLedgersByEntityAPI(entityType, cursor);
      return data || { transactions: [], pagination: {}, currentBalance: 0 };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: !!entityType,
  });
};

// Search ledgers by entity with cursor
export const useSearchLedgersByEntity = (entityType, searchTerm, cursor) => {
  return useQuery({
    queryKey: ["ledger-search", entityType, searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchLedgerByEntityAPI(
        entityType,
        searchTerm,
        cursor,
      );
      return data || { data: [], pagination: {} };
    },
    enabled: !!entityType && !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

// Filter ledgers by entity with cursor
export const useFilterLedgers = (entityType, filters, cursor) => {
  return useQuery({
    queryKey: ["ledger-filter", entityType, filters, cursor],
    queryFn: async () => {
      const { data } = await filterLedgerAPI(entityType, filters, cursor);
      return data || { transactions: [], pagination: {}, currentBalance: 0 };
    },
    enabled: !!entityType && !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
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
