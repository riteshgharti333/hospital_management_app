import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSupplierLedgerEntryAPI,
  getAllSupplierLedgerEntriesAPI,
  getSupplierLedgerEntryByIdAPI,
  getSupplierOutstandingBalanceAPI,
  getSupplierSummaryReportAPI,
  updateSupplierLedgerEntryAPI,
  deleteSupplierLedgerEntryAPI,
} from "../ledgerApi/supplierLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetSupplierLedgerEntries = () => {
  return useQuery({
    queryKey: ["supplierLedgerEntries"],
    queryFn: async () => {
      const { data } = await getAllSupplierLedgerEntriesAPI();
      return data.data;
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetSupplierLedgerEntryById = (id) => {
  return useQuery({
    queryKey: ["supplierLedgerEntry", id],
    queryFn: async () => {
      const { data } = await getSupplierLedgerEntryByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetSupplierOutstandingBalance = () => {
  return useQuery({
    queryKey: ["supplierOutstandingBalance"],
    queryFn: async () => {
      const { data } = await getSupplierOutstandingBalanceAPI();
      return data.data;
    },
    select: (data) => data || {},
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetSupplierSummaryReport = () => {
  return useQuery({
    queryKey: ["supplierSummaryReport"],
    queryFn: async () => {
      const { data } = await getSupplierSummaryReportAPI();
      return data.data;
    },
    select: (data) => data || {},
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreateSupplierLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplierLedgerEntryAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["supplierLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateSupplierLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSupplierLedgerEntryAPI(id, data),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Entry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["supplierLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteSupplierLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSupplierLedgerEntryAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["supplierLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
