import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDoctorLedgerEntryAPI,
  getAllDoctorLedgerEntriesAPI,
  getDoctorLedgerEntryByIdAPI,
  getDoctorBalanceAPI,
  updateDoctorLedgerEntryAPI,
  deleteDoctorLedgerEntryAPI,
} from "../ledgerApi/doctorLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetDoctorLedgerEntries = () => {
  return useQuery({
    queryKey: ["doctorLedgerEntries"],
    queryFn: async () => {
      const { data } = await getAllDoctorLedgerEntriesAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data || [],
  });
};

export const useGetDoctorLedgerEntryById = (id) => {
  return useQuery({
    queryKey: ["doctorLedgerEntry", id],
    queryFn: async () => {
      const { data } = await getDoctorLedgerEntryByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetDoctorBalance = () => {
  return useQuery({
    queryKey: ["doctorBalance"],
    queryFn: async () => {
      const { data } = await getDoctorBalanceAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data ?? 0,
  });
};

export const useCreateDoctorLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDoctorLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Doctor ledger entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["doctorLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateDoctorLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDoctorLedgerEntryAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Doctor ledger entry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["doctorLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteDoctorLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDoctorLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Doctor ledger entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["doctorLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
