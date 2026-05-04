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
export const useGetDoctors = (cursor) => {
  return useQuery({
    queryKey: ["doctor", cursor],
    queryFn: async () => {
      const { data } = await getAllDoctorsAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

// Filter doctors with cursor
export const useFilterDoctors = (filters, cursor) => {
  return useQuery({
    queryKey: ["doctor-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterDoctorAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
  });
};

// Search doctors with cursor
export const useSearchDoctors = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["doctor-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchDoctorAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true, 
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

