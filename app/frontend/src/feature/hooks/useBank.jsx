import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBankAPI,
  deleteBankAPI,
  getAllBanksAPI,
  getBankByIdAPI,
  updateBankAPI,
  filterBankAPI,
  searchBankAPI,
} from "../api/bankApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Normal banks
export const useGetBanks = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["bank", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllBanksAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: false,
    staleTime: 0,
    retry: 1,
  });
};

// Filter banks
export const useFilterBanks = (filters) => {
  return useQuery({
    queryKey: ["bank-filter", filters],
    queryFn: async () => {
      const { data } = await filterBankAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// FETCH BANK BY ID
export const useGetBankById = (id) => {
  return useQuery({
    queryKey: ["bank", id],
    queryFn: async () => {
      const { data } = await getBankByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE BANK
export const useCreateBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBankAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Bank account created successfully");
      queryClient.invalidateQueries({ queryKey: ["bank"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE BANK
export const useUpdateBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBankAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Bank account updated successfully");
      queryClient.invalidateQueries({ queryKey: ["bank"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE BANK
export const useDeleteBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBankAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Bank account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["bank"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// SEARCH BANKS
export const useSearchBanks = (searchTerm) => {
  return useQuery({
    queryKey: ["bank-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchBankAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};