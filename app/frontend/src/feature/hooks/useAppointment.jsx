import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAppointmentAPI,
  deleteAppointmentAPI,
  getAppointmentByIdAPI,
  updateAppointmentAPI,
   getAllAppointmentsAPI,
  filterAppointmentAPI,
} from "../api/appointmentApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";



// Normal appointment list
export const useGetAppointments = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["appointment", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllAppointmentsAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// Filter appointment list
export const useFilterAppointments = (filters) => {
  return useQuery({
    queryKey: ["appointment-filter", filters],
    queryFn: async () => {
      const { data } = await filterAppointmentAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// FETCH APPOINTMENT BY ID
export const useGetAppointmentById = (id) => {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: async () => {
      const { data } = await getAppointmentByIdAPI(id);
      return data?.data;
    },
    enabled: !!id,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE APPOINTMENT
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointmentAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Appointment created successfully");
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE APPOINTMENT
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAppointmentAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.message || "Appointment updated successfully");
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE APPOINTMENT
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAppointmentAPI,
    onSuccess: (response) => {
      toast.success(response?.message || "Appointment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
