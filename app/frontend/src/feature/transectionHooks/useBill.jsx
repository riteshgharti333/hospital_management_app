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

export const useGetBills = (cursor, limit = 50) => {
  return useQuery({
    queryKey: ["bills", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllBillsAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
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

export const useSearchBills = (searchTerm) => {
  return useQuery({
    queryKey: ["bill-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchBillsAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

export const useFilterBills = (filters) => {
  return useQuery({
    queryKey: ["bill-filter", filters],
    queryFn: async () => {
      const { data } = await filterBillsAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};
