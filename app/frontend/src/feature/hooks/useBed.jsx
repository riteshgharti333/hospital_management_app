import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBedRecordAPI,
  deleteBedRecordAPI,
  getAllBedRecordsAPI,
  getBedRecordByIdAPI,
  updateBedRecordAPI,
} from "../api/bedApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetBeds = () => {
  return useQuery({
    queryKey: ["bed"],
    queryFn: async () => {
      const { data } = await getAllBedRecordsAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data || [],
  });
};

export const useGetBedById = (id) => {
  return useQuery({
    queryKey: ["bed", id],
    queryFn: async () => {
      const { data } = await getBedRecordByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreateBed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBedRecordAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Bed created successfully");
      queryClient.invalidateQueries({ queryKey: ["bed"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateBed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBedRecordAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.message || "Bed updated successfully");
      queryClient.invalidateQueries({ queryKey: ["bed"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteBed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBedRecordAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Bed deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["bed"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
