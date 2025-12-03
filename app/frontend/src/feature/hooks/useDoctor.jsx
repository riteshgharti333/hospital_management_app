import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDoctorAPI,
  deleteDoctorAPI,
  getAllDoctorsAPI,
  getDoctorByIdAPI,
  updateDoctorAPI,
  filterDoctorAPI,
  searchDoctorAPI,
} from "../api/doctorApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// Normal doctors
export const useGetDoctors = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["doctor", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllDoctorsAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// Filter doctors
export const useFilterDoctors = (filters) => {
  return useQuery({
    queryKey: ["doctor-filter", filters],
    queryFn: async () => {
      const { data } = await filterDoctorAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// FETCH DOCTOR BY ID
export const useGetDoctorById = (id) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const { data } = await getDoctorByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE DOCTOR
export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDoctorAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Doctor created successfully");
      queryClient.invalidateQueries({ queryKey: ["doctor"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE DOCTOR
export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDoctorAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Doctor updated successfully");
      queryClient.invalidateQueries({ queryKey: ["doctor"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE DOCTOR
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDoctorAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Doctor deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["doctor"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useSearchDoctors = (searchTerm) => {
  return useQuery({
    queryKey: ["doctor-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchDoctorAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
