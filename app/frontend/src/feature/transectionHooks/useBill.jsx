import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBillAPI,
  getAllBillsAPI,
  getBillByIdAPI,
  updateBillAPI,
  deleteBillAPI,
  filterBillsAPI,
  searchBillsAPI,
} from "../transectionApi/billApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Normal bills with cursor pagination
export const useGetBills = (cursor) => {
  return useQuery({
    queryKey: ["bills", cursor],
    queryFn: async () => {
      const { data } = await getAllBillsAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

// Search bills with cursor
export const useSearchBills = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["bill-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchBillsAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

// Filter bills with cursor
export const useFilterBills = (filters, cursor) => {
  return useQuery({
    queryKey: ["bill-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterBillsAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
  });
};


export const useGetBillById = (id) => {
  return useQuery({
    queryKey: ["bill", id],
    queryFn: async () => {
      const { data } = await getBillByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreateBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBillAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Bill created successfully");
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBillAPI(id, data),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Bill updated successfully");
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBillAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Bill deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

