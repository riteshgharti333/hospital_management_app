import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBillAPI,
  getAllBillsAPI,
  getBillByIdAPI,
  updateBillAPI,
  deleteBillAPI,
} from "../transectionApi/billApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetBills = () => {
  return useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      const { data } = await getAllBillsAPI();
      return data.data;
    },
    select: (data) => data || [],
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
