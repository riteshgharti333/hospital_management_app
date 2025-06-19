import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDiagnosticsLedgerEntryAPI,
  getAllDiagnosticsLedgerEntriesAPI,
  getDiagnosticsLedgerEntryByIdAPI,
  getDiagnosticsTotalRecordAPI,
  updateDiagnosticsLedgerEntryAPI,
  deleteDiagnosticsLedgerEntryAPI,
} from "../ledgerApi/diagnosticsLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetDiagnosticsLedgerEntries = () => {
  return useQuery({
    queryKey: ["diagnosticsLedgerEntries"],
    queryFn: async () => {
      const { data } = await getAllDiagnosticsLedgerEntriesAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data || [],
  });
};

export const useGetDiagnosticsLedgerEntryById = (id) => {
  return useQuery({
    queryKey: ["diagnosticsLedgerEntry", id],
    queryFn: async () => {
      const { data } = await getDiagnosticsLedgerEntryByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetDiagnosticsTotalRecord = () => {
  return useQuery({
    queryKey: ["diagnosticsTotalRecord"],
    queryFn: async () => {
      const { data } = await getDiagnosticsTotalRecordAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data ?? 0,
  });
};

export const useCreateDiagnosticsLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDiagnosticsLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Diagnostics ledger entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["diagnosticsLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateDiagnosticsLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDiagnosticsLedgerEntryAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Diagnostics ledger entry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["diagnosticsLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteDiagnosticsLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDiagnosticsLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Diagnostics ledger entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["diagnosticsLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
