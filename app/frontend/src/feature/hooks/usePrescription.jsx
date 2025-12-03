import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPrescriptionAPI,
  deletePrescriptionAPI,
  getAllPrescriptionsAPI,
  getPrescriptionByIdAPI,
  updatePrescriptionAPI,
  filterPrescriptionAPI,
  searchPrescriptionAPI,
} from "../api/prescriptionApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Normal prescriptions list
export const useGetPrescriptions = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["prescription", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllPrescriptionsAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// Filtered prescriptions list
export const useFilterPrescriptions = (filters) => {
  return useQuery({
    queryKey: ["prescription-filter", filters],
    queryFn: async () => {
      const { data } = await filterPrescriptionAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
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

export const useSearchPrescriptions = (searchTerm) => {
  return useQuery({
    queryKey: ["prescription-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchPrescriptionAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
