import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPatientLedgerEntryAPI,
  getAllPatientLedgerEntriesAPI,
  getPatientLedgerEntryByIdAPI,
  getPatientBalanceAPI,
  updatePatientLedgerEntryAPI,
  deletePatientLedgerEntryAPI,
  filterPatientLedgerAPI,
  searchPatientLedgerAPI,
} from "../ledgerApi/patientLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetPatientLedgerEntries = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["patientLedgerEntries", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllPatientLedgerEntriesAPI(cursor, limit);
      return data || { data: [], pagination: {} };
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
      console.log(data);
      console.log("hello");
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
      toast.success(
        response?.data?.message || "Patient entry created successfully"
      );
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
      toast.success(
        response?.data?.message || "Patient entry updated successfully"
      );
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
      toast.success(
        response?.data?.message || "Patient entry deleted successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["patientLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useSearchPatientLedger = (searchTerm) => {
  return useQuery({
    queryKey: ["patient-ledger-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchPatientLedgerAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useFilterPatientLedger = (filters) => {
  return useQuery({
    queryKey: ["patient-ledger-filter", filters],
    queryFn: async () => {
      const { data } = await filterPatientLedgerAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
