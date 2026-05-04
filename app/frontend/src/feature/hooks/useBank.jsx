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

// Normal banks with cursor pagination
export const useGetBanks = (cursor) => {
  return useQuery({
    queryKey: ["bank", cursor],
    queryFn: async () => {
      const { data } = await getAllBanksAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

// Search banks with cursor
export const useSearchBanks = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["bank-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchBankAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

// Filter banks with cursor
export const useFilterBanks = (filters, cursor) => {
  return useQuery({
    queryKey: ["bank-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterBankAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
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
      toast.success(
        response?.data?.message || "Bank account created successfully",
      );
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
      toast.success(
        response?.data?.message || "Bank account updated successfully",
      );
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
      toast.success(
        response?.data?.message || "Bank account deleted successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["bank"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
