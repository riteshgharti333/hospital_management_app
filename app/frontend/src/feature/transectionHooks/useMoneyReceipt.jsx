import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMoneyReceiptAPI,
  getAllMoneyReceiptsAPI,
  getMoneyReceiptByIdAPI,
  updateMoneyReceiptAPI,
  deleteMoneyReceiptAPI,
  filterMoneyReceiptAPI,
  searchMoneyReceiptAPI,
} from "../transectionApi/moneyReceiptApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetMoneyReceipts = (cursor, limit = 50) => {
  return useQuery({
    queryKey: ["moneyReceipt", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllMoneyReceiptsAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetMoneyReceiptById = (id) => {
  return useQuery({
    queryKey: ["moneyReceipt", id],
    queryFn: async () => {
      const { data } = await getMoneyReceiptByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreateMoneyReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMoneyReceiptAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Money receipt created successfully");
      // ✅ FIXED: Use "moneyReceipt" (singular) to match useGetMoneyReceipts
      queryClient.invalidateQueries({ queryKey: ["moneyReceipt"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateMoneyReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMoneyReceiptAPI(id, data),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Money receipt updated successfully");
      // ✅ FIXED: Use "moneyReceipt" (singular) to match useGetMoneyReceipts
      queryClient.invalidateQueries({ queryKey: ["moneyReceipt"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteMoneyReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMoneyReceiptAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Money receipt deleted successfully");
      // ✅ FIXED: Use "moneyReceipt" (singular) to match useGetMoneyReceipts
      queryClient.invalidateQueries({ queryKey: ["moneyReceipt"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// SEARCH
export const useSearchMoneyReceipts = (searchTerm) => {
  return useQuery({
    queryKey: ["moneyReceipt", "search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchMoneyReceiptAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

// FILTER
export const useFilterMoneyReceipts = (filters) => {
  return useQuery({
    queryKey: ["moneyReceipt", "filter", filters],
    queryFn: async () => {
      const { data } = await filterMoneyReceiptAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};