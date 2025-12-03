import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdmissionAPI,
  deleteAdmissionAPI,
  getAllAdmissionAPI,
  getAdmissionByIdAPI,
  updateAdmissionAPI,
  searchAdmissionAPI,
  filterAdmissionsAPI,
} from "../api/admissionApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetAdmissions = (cursor, limit = 50) => {
  return useQuery({
    queryKey: ["admission", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllAdmissionAPI(cursor, limit);
      return data || { data: [], pagination: {} };
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

export const useSearchAdmissions = (searchTerm) => {
  return useQuery({
    queryKey: ["admission-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchAdmissionAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useFilterAdmissions = (filters) => {
  return useQuery({
    queryKey: ["admission-filter", filters],
    queryFn: async () => {
      const { data } = await filterAdmissionsAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters, // only run if filters exist
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
