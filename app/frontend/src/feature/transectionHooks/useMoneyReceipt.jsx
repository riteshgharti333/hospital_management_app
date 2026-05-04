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

// Normal money receipts with cursor pagination
export const useGetMoneyReceipts = (cursor) => {
  return useQuery({
    queryKey: ["moneyReceipt", cursor],
    queryFn: async () => {
      const { data } = await getAllMoneyReceiptsAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

// Get money receipt by ID (keep this as is - it's for detail view)
export const useGetMoneyReceiptById = (id) => {
  return useQuery({
    queryKey: ["moneyReceipt", id],
    queryFn: async () => {
      const { data } = await getMoneyReceiptByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
  });
};

// Search money receipts with cursor
export const useSearchMoneyReceipts = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["moneyReceipt-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchMoneyReceiptAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

// Filter money receipts with cursor
export const useFilterMoneyReceipts = (filters, cursor) => {
  return useQuery({
    queryKey: ["moneyReceipt-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterMoneyReceiptAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
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
