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

// Normal cash accounts
export const useGetCashAccounts = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["cash", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllCashAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: false,
    staleTime: 0,
    retry: 1,
  });
};

// Filter cash accounts
export const useFilterCashAccounts = (filters) => {
  return useQuery({
    queryKey: ["cash-filter", filters],
    queryFn: async () => {
      const { data } = await filterCashAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
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
      toast.success(response?.data?.message || "Cash account created successfully");
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
      toast.success(response?.data?.message || "Cash account updated successfully");
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
      toast.success(response?.data?.message || "Cash account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["cash"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// SEARCH CASH ACCOUNTS
export const useSearchCashAccounts = (searchTerm) => {
  return useQuery({
    queryKey: ["cash-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchCashAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};