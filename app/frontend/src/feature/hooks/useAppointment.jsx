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


// GET ALL with cursor pagination
export const useGetAppointments = (cursor) => {
  return useQuery({
    queryKey: ["appointment", cursor],
    queryFn: async () => {
      const { data } = await getAllAppointmentsAPI(cursor);
      return data || { data: [], pagination: {} };
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
    enabled: true,
  });
};

// SEARCH with cursor
export const useSearchAppointments = (searchTerm, cursor) => {
  return useQuery({
    queryKey: ["appointment-search", searchTerm, cursor],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], pagination: {} };
      }
      const { data } = await searchAppointmentAPI(searchTerm, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    retry: 1,
    keepPreviousData: true,
  });
};

// FILTER with cursor
export const useFilterAppointments = (filters, cursor) => {
  return useQuery({
    queryKey: ["appointment-filter", filters, cursor],
    queryFn: async () => {
      const { data } = await filterAppointmentAPI(filters, cursor);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters && Object.keys(filters).length > 0,
    retry: 1,
    keepPreviousData: true,
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
