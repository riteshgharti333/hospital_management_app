import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAppointmentAPI,
  deleteAppointmentAPI,
  getAllAppointmentsAPI,
  getAppointmentByIdAPI,
  updateAppointmentAPI,
} from "../api/appointmentApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// FETCH ALL APPOINTMENTS
export const useGetAppointments = () => {
  return useQuery({
    queryKey: ["appointment"],
    queryFn: async () => {
      const { data } = await getAllAppointmentsAPI();
      return data?.data || [];
    },
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
