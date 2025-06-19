import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createInsuranceLedgerEntryAPI,
  getAllInsuranceLedgerEntriesAPI,
  getInsuranceLedgerEntryByIdAPI,
  getInsuranceSummaryAPI,
  updateInsuranceLedgerEntryAPI,
  deleteInsuranceLedgerEntryAPI,
} from "../ledgerApi/insuranceLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetInsuranceLedgerEntries = () => {
  return useQuery({
    queryKey: ["insuranceLedgerEntries"],
    queryFn: async () => {
      const { data } = await getAllInsuranceLedgerEntriesAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data || [],
  });
};

export const useGetInsuranceLedgerEntryById = (id) => {
  return useQuery({
    queryKey: ["insuranceLedgerEntry", id],
    queryFn: async () => {
      const { data } = await getInsuranceLedgerEntryByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetInsuranceSummary = () => {
  return useQuery({
    queryKey: ["insuranceSummary"],
    queryFn: async () => {
      const { data } = await getInsuranceSummaryAPI();
      return data.data;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    select: (data) => data ?? {},
  });
};

export const useCreateInsuranceLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInsuranceLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Insurance entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["insuranceLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateInsuranceLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateInsuranceLedgerEntryAPI(id, data),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Insurance entry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["insuranceLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteInsuranceLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInsuranceLedgerEntryAPI,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Insurance entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["insuranceLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
