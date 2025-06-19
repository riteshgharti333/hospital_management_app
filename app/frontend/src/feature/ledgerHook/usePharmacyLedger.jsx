import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPharmacyLedgerEntryAPI,
  getAllPharmacyLedgerEntriesAPI,
  getPharmacyLedgerEntryByIdAPI,
  getPharmacyFinancialSummaryAPI,
  getPharmacyCategorySummaryAPI,
  updatePharmacyLedgerEntryAPI,
  deletePharmacyLedgerEntryAPI,
} from "../ledgerApi/pharmacyLedgerApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";


export const useGetPharmacyLedgerEntries = () => {
  return useQuery({
    queryKey: ["pharmacyLedgerEntries"],
    queryFn: async () => {
      const { data } = await getAllPharmacyLedgerEntriesAPI();
      return data.data;
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};


export const useGetPharmacyLedgerEntryById = (id) => {
  return useQuery({
    queryKey: ["pharmacyLedgerEntry", id],
    queryFn: async () => {
      const { data } = await getPharmacyLedgerEntryByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};


export const useGetPharmacyFinancialSummary = () => {
  return useQuery({
    queryKey: ["pharmacyFinancialSummary"],
    queryFn: async () => {
      const { data } = await getPharmacyFinancialSummaryAPI();
      return data.data;
    },
    select: (data) => data || {},
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};


export const useGetPharmacyCategorySummary = () => {
  return useQuery({
    queryKey: ["pharmacyCategorySummary"],
    queryFn: async () => {
      const { data } = await getPharmacyCategorySummaryAPI();
      return data.data;
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};


export const useCreatePharmacyLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPharmacyLedgerEntryAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["pharmacyLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};


export const useUpdatePharmacyLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePharmacyLedgerEntryAPI(id, data),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Entry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["pharmacyLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeletePharmacyLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePharmacyLedgerEntryAPI,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pharmacyLedgerEntries"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
