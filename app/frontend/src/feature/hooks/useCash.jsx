import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCashAPI,
  deleteCashAPI,
  getAllCashAPI,
  getCashByIdAPI,
  updateCashAPI,
  filterCashAPI,
  searchCashAPI,
} from "../api/cashApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Normal cash accounts with cursor pagination
export const useGetCashAccounts = (cursor) => {
  return useQuery({
    queryKey: ["cash", cursor],
    queryFn: async () => {
      const { data } = await getAllCashAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

// Search cash accounts with cursor
export const useSearchCashAccounts = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["cash-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchCashAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

// Filter cash accounts with cursor
export const useFilterCashAccounts = (filters, cursor) => {
  return useQuery({
    queryKey: ["cash-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterCashAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
  });
};

// FETCH CASH ACCOUNT BY ID
export const useGetCashAccountById = (id) => {
  return useQuery({
    queryKey: ["cash", id],
    queryFn: async () => {
      const { data } = await getCashByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE CASH ACCOUNT
export const useCreateCashAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCashAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Cash account created successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["cash"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE CASH ACCOUNT
export const useUpdateCashAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCashAPI(id, data),
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Cash account updated successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["cash"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE CASH ACCOUNT
export const useDeleteCashAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCashAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Cash account deleted successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["cash"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
