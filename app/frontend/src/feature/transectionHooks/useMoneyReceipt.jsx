import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMoneyReceiptAPI,
  getAllMoneyReceiptsAPI,
  getMoneyReceiptByIdAPI,
  updateMoneyReceiptAPI,
  deleteMoneyReceiptAPI,
} from "../transectionApi/moneyReceiptApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetMoneyReceipts = () => {
  return useQuery({
    queryKey: ["moneyReceipts"],
    queryFn: async () => {
      const { data } = await getAllMoneyReceiptsAPI();
      return data.data;
    },
    select: (data) => data || [],
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
      queryClient.invalidateQueries({ queryKey: ["moneyReceipts"] });
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
      queryClient.invalidateQueries({ queryKey: ["moneyReceipts"] });
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
      queryClient.invalidateQueries({ queryKey: ["moneyReceipts"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
