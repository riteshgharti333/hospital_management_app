import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBrandAPI,
  getAllBrandsAPI,
  getBrandByIdAPI,
  updateBrandAPI,
  deleteBrandAPI,
} from "../itemApi/brandApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await getAllBrandsAPI();
      return data.data;
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetBrandById = (id) => {
  return useQuery({
    queryKey: ["brand", id],
    queryFn: async () => {
      const { data } = await getBrandByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBrandAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Brand created successfully");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBrandAPI(id, data),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Brand updated successfully");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBrandAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Brand deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
