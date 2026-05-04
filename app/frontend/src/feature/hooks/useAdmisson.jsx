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


// Updated Admission Hooks
export const useGetAdmissions = (cursor) => {
  return useQuery({
    queryKey: ["admission", cursor],
    queryFn: async () => {
      const { data } = await getAllAdmissionAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

export const useSearchAdmissions = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["admission-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchAdmissionAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

export const useFilterAdmissions = (filters, cursor) => {
  return useQuery({
    queryKey: ["admission-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterAdmissionsAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
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
        response?.data?.message || "Admission created successfully",
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
        response?.data?.message || "Admission updated successfully",
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
        response?.data?.message || "Admission deleted successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["admission"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};


