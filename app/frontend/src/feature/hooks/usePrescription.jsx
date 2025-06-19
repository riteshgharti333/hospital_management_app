import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPrescriptionAPI,
  deletePrescriptionAPI,
  getAllPrescriptionsAPI,
  getPrescriptionByIdAPI,
  updatePrescriptionAPI,
} from "../api/prescriptionApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetPrescriptions = () => {
  return useQuery({
    queryKey: ["prescription"],
    queryFn: async () => {
      const { data } = await getAllPrescriptionsAPI();
      return data?.data || [];
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetPrescriptionById = (id) => {
  return useQuery({
    queryKey: ["prescription", id],
    queryFn: async () => {
      const { data } = await getPrescriptionByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPrescriptionAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Prescription created successfully");
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePrescriptionAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.message || "Prescription updated successfully");
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeletePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePrescriptionAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Prescription deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
