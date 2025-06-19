import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductAPI,
  getAllProductsAPI,
  getProductByIdAPI,
  updateProductAPI,
  deleteProductAPI,
} from "../itemApi/productApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await getAllProductsAPI();
      return data.data;
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetProductById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await getProductByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateProductAPI(id, data),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
