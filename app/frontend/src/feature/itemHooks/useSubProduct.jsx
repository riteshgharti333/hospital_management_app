import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductEntryAPI,
  getAllProductEntriesAPI,
  getProductEntryByIdAPI,
  updateProductEntryAPI,
  deleteProductEntryAPI,
} from "../itemApi/subProductApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetProductEntries = () => {
  return useQuery({
    queryKey: ["productEntries"],
    queryFn: async () => {
      const { data } = await getAllProductEntriesAPI();
      return data.data;
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetProductEntryById = (id) => {
  return useQuery({
    queryKey: ["productEntry", id],
    queryFn: async () => {
      const { data } = await getProductEntryByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreateProductEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductEntryAPI,
    onSuccess: (res) => {
      toast.success(res?.message || "Product entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["productEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateProductEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateProductEntryAPI(id, data),
    onSuccess: (res) => {
      toast.success(res?.message || "Product entry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["productEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteProductEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductEntryAPI,
    onSuccess: (res) => {
      toast.success(res?.message || "Product entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["productEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
