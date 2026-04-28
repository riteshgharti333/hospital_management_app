import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAppointmentAPI,
  deleteAppointmentAPI,
  getAllAppointmentsAPI,
  getAppointmentByIdAPI,
  updateAppointmentAPI,
  filterAppointmentAPI,
  searchAppointmentAPI,
  cancelAppointmentAPI,
  getAppointmentsByDoctorAPI,
  getAvailableSlotsAPI,
  updateExpiredAppointmentsAPI,
} from "../api/appointmentApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

// GET ALL
export const useGetAppointments = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["appointment", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllAppointmentsAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: false,
    staleTime: 0,
    retry: 1,
  });
};

// FILTER
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

// SEARCH
export const useSearchAppointments = (searchTerm) => {
  return useQuery({
    queryKey: ["appointment-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchAppointmentAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

// GET BY ID
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

// GET APPOINTMENTS BY DOCTOR
export const useGetAppointmentsByDoctor = (doctorId) => {
  return useQuery({
    queryKey: ["appointment-doctor", doctorId],
    queryFn: async () => {
      const { data } = await getAppointmentsByDoctorAPI(doctorId);
      return data?.data || [];
    },
    enabled: !!doctorId,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// GET AVAILABLE SLOTS
export const useGetAvailableSlots = (doctorId, date) => {
  return useQuery({
    queryKey: ["appointment-slots", doctorId, date],
    queryFn: async () => {
      const { data } = await getAvailableSlotsAPI(doctorId, date);
      return data?.data;
    },
    enabled: !!doctorId && !!date,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CREATE
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointmentAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Appointment created successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAppointmentAPI(id, data),
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Appointment updated successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// CANCEL APPOINTMENT
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointmentAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Appointment cancelled successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// DELETE
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAppointmentAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Appointment deleted successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// UPDATE EXPIRED (Admin)
export const useUpdateExpiredAppointments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExpiredAppointmentsAPI,
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Expired appointments updated successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
