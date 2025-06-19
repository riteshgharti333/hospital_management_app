import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDoctorAPI,
  deleteDoctorAPI,
  getAllDoctorsAPI,
  getDoctorByIdAPI,
  updateDoctorAPI,
} from "../api/doctorApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// FETCH ALL DOCTORS
export const useGetDoctors = () => {
  return useQuery({
    queryKey: ["doctor"],
    queryFn: async () => {
      const { data } = await getAllDoctorsAPI();
      return data?.data || [];
    },
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
