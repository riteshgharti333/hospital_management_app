import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdmissionAnalyticsAPI,
  getAdmissionGenderDistributionAPI,
  getAdmissionMonthlyTrendAPI,
  getBillingVsReceiptAPI,
  getBillMoneyStatusAnalyticsAPI,
  getBillStatusAnalyticsAPI,
  getPatientAgeDistributionAPI,
  getPatientAnalyticsAPI,
  getPatientLedgerFlowSummaryAPI,
  getPaymentModeAnalyticsAPI,
  getRevenueAnalyticsAPI,
} from "../dashboardApi/chartsApi";
import { getErrorMessage } from "../../utils/errorUtils";

export const useRevenueAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard-revenue"],
    queryFn: async () => {
      const { data } = await getRevenueAnalyticsAPI();
      return data.data;
    },
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

export const useBillStatusAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard-bill-status"],
    queryFn: async () => {
      const { data } = await getBillStatusAnalyticsAPI();
      return data.data;
    },
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

export const usePatientAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard-patient-analytics"],
    queryFn: async () => {
      const { data } = await getPatientAnalyticsAPI();
      return data.data;
    },
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

export const useAdmissionAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard-admission-analytics"],
    queryFn: async () => {
      const { data } = await getAdmissionAnalyticsAPI();
      return data.data;
    },
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

export const useAdmissionMonthlyTrend = () => {
  return useQuery({
    queryKey: ["dashboard-admission-monthly-trend"],
    queryFn: async () => {
      const { data } = await getAdmissionMonthlyTrendAPI();
      return data.data;
    },
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

export const useAdmissionGenderDistribution = () => {
  return useQuery({
    queryKey: ["dashboard-admission-gender-distribution"],
    queryFn: async () => {
      const { data } = await getAdmissionGenderDistributionAPI();
      return data.data;
    },
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

export const usePatientAgeDistribution = () => {
  return useQuery({
    queryKey: ["dashboard-patient-age-distribution"],
    queryFn: async () => {
      const { data } = await getPatientAgeDistributionAPI();
      return data.data;
    },
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

// 1️⃣ Bill Status Analytics
export const useBillMoneyStatusAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard-bill-status"],
    queryFn: async () => {
      const { data } = await getBillMoneyStatusAnalyticsAPI();
      return data.data;
    },
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

// 2️⃣ Payment Mode Breakdown
export const usePaymentModeAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard-payment-modes"],
    queryFn: async () => {
      const { data } = await getPaymentModeAnalyticsAPI();
      return data.data;
    },
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

// 3️⃣ Billing vs Receipt (Monthly)
export const useBillingVsReceipt = () => {
  return useQuery({
    queryKey: ["dashboard-billing-vs-receipt"],
    queryFn: async () => {
      const { data } = await getBillingVsReceiptAPI();
      return data.data;
    },
    retry: 1,
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

export const usePatientLedgerFlowSummary = () => {
  return useQuery({
    queryKey: ["ledger-flow-summary"],
    queryFn: async () => {
      const { data } = await getPatientLedgerFlowSummaryAPI();
      return data.data; // return only the object inside "data"
    },
    retry: 1,
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};
