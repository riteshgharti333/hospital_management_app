import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPatientLedgerEntryAPI,
  getAllPatientLedgerEntriesAPI,
  getPatientLedgerEntryByIdAPI,
  getPatientBalanceAPI,
  updatePatientLedgerEntryAPI,
  deletePatientLedgerEntryAPI,
} from "../ledgerApi/patientLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetPatientLedgerEntries = () => {
  return useQuery({
    queryKey: ["patientLedgerEntries"],
    queryFn: async () => {
      const { data } = await getAllPatientLedgerEntriesAPI();
      return data.data;
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetPatientLedgerEntryById = (id) => {
  return useQuery({
    queryKey: ["patientLedgerEntry", id],
    queryFn: async () => {
      const { data } = await getPatientLedgerEntryByIdAPI(id);
      console.log(data)
      console.log("hello")
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetPatientBalance = () => {
  return useQuery({
    queryKey: ["patientBalance"],
    queryFn: async () => {
      const { data } = await getPatientBalanceAPI();
      return data.data;
    },
    select: (data) => data ?? {},
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreatePatientLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPatientLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Patient entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["patientLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdatePatientLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePatientLedgerEntryAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Patient entry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["patientLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeletePatientLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePatientLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Patient entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["patientLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
