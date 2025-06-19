import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdmissionAPI,
  deleteAdmissionAPI,
  getAllAdmissionAPI,
  getAdmissionByIdAPI,
  updateAdmissionAPI,
} from "../api/admissionApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetAdmissions = () => {
  return useQuery({
    queryKey: ["admission"],
    queryFn: async () => {
      const { data } = await getAllAdmissionAPI();
      return data?.data || [];
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetAdmissionById = (id) => {
  return useQuery({
    queryKey: ["admission", id],
    queryFn: async () => {
      const { data } = await getAdmissionByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreateAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdmissionAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Admission created successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["admission"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAdmissionAPI(id, data),
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Admission updated successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["admission"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdmissionAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Admission deleted successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["admission"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
