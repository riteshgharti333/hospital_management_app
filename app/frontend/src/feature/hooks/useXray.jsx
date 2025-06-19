import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createXrayReportAPI,
  getAllXrayReportsAPI,
  getXrayReportByIdAPI,
  getXrayFinancialSummaryAPI,
  getXrayDoctorWiseSummaryAPI,
  updateXrayReportAPI,
  deleteXrayReportAPI,
} from "../api/xrayApi";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/errorUtils";

export const useGetXrayReports = () => {
  return useQuery({
    queryKey: ["xrayReports"],
    queryFn: async () => {
      const { data } = await getAllXrayReportsAPI();
      return data.data;
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetXrayReportById = (id) => {
  return useQuery({
    queryKey: ["xrayReport", id],
    queryFn: async () => {
      const { data } = await getXrayReportByIdAPI(id);
      return data.data;
    },
    enabled: !!id,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetXrayFinancialSummary = () => {
  return useQuery({
    queryKey: ["xrayFinancialSummary"],
    queryFn: async () => {
      const { data } = await getXrayFinancialSummaryAPI();
      return data.data;
    },
    select: (data) => data || {},
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetXrayDoctorWiseSummary = () => {
  return useQuery({
    queryKey: ["xrayDoctorWiseSummary"],
    queryFn: async () => {
      const { data } = await getXrayDoctorWiseSummaryAPI();
      return data.data;
    },
    select: (data) => data || [],
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useCreateXrayReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createXrayReportAPI,
    onSuccess: (res) => {
      toast.success(res?.message || "X-ray report created successfully");
      queryClient.invalidateQueries({ queryKey: ["xrayReports"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateXrayReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateXrayReportAPI(id, data),
    onSuccess: (res) => {
      toast.success(res?.message || "X-ray report updated successfully");
      queryClient.invalidateQueries({ queryKey: ["xrayReports"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteXrayReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteXrayReportAPI,
    onSuccess: (res) => {
      toast.success(res?.message || "X-ray report deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["xrayReports"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
