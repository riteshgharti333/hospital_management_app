import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDoctorLedgerEntryAPI,
  getAllDoctorLedgerEntriesAPI,
  getDoctorLedgerEntryByIdAPI,
  getDoctorBalanceAPI,
  updateDoctorLedgerEntryAPI,
  deleteDoctorLedgerEntryAPI,
  filterDoctorLedgerAPI,
  searchDoctorLedgerAPI,
} from "../ledgerApi/doctorLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetDoctorLedgerEntries = (cursor = null, limit = 50) => {
  return useQuery({
    queryKey: ["doctorLedgerEntries", cursor, limit],
    queryFn: async () => {
      const { data } = await getAllDoctorLedgerEntriesAPI(cursor, limit);
      return data || { data: [], pagination: {} };
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
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
      toast.success(
        response?.data?.message || "Doctor ledger entry created successfully"
      );
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
      toast.success(
        response?.data?.message || "Doctor ledger entry updated successfully"
      );
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
      toast.success(
        response?.data?.message || "Doctor ledger entry deleted successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["doctorLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useSearchDoctorLedger = (searchTerm) => {
  return useQuery({
    queryKey: ["doctor-ledger-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data } = await searchDoctorLedgerAPI(searchTerm);
      return data?.data || [];
    },
    enabled: !!searchTerm,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useFilterDoctorLedger = (filters) => {
  return useQuery({
    queryKey: ["doctor-ledger-filter", filters],
    queryFn: async () => {
      const { data } = await filterDoctorLedgerAPI(filters);
      return data || { data: [], pagination: {} };
    },
    enabled: !!filters,
    retry: 1,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
