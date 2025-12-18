import axiosInstance from "../../utils/axiosInstance";


// Revenue Summary
export const getRevenueAnalyticsAPI = () =>
  axiosInstance.get("/dashboard/revenue/summary");

// Payment Mode Breakdown
export const getPaymentModeAnalyticsAPI = () =>
  axiosInstance.get("/dashboard/revenue/payment-modes");

// Billing vs Receipt (Monthly)
export const getBillingVsReceiptAPI = () =>
  axiosInstance.get("/dashboard/revenue/billing-vs-receipt");

// Ledger Flow Summary
export const getPatientLedgerFlowSummaryAPI = () =>
  axiosInstance.get("/dashboard/ledger/flow-summary");

/* =========================
   BILLING
========================= */

// Bill Status Breakdown (Chart)
export const getBillStatusAnalyticsAPI = () =>
  axiosInstance.get("/dashboard/billing/status-breakdown");

// Bill Status Summary (Counts)
export const getBillMoneyStatusAnalyticsAPI = () =>
  axiosInstance.get("/dashboard/billing/status-summary");

/* =========================
   PATIENTS
========================= */

// Patient Overview Analytics
export const getPatientAnalyticsAPI = () =>
  axiosInstance.get("/dashboard/patients/overview");

// Patient Age Distribution
export const getPatientAgeDistributionAPI = () =>
  axiosInstance.get("/dashboard/patients/age-distribution");

/* =========================
   ADMISSIONS
========================= */

// Admission Overview Analytics
export const getAdmissionAnalyticsAPI = () =>
  axiosInstance.get("/dashboard/admissions/overview");

// Monthly Admission Trend
export const getAdmissionMonthlyTrendAPI = () =>
  axiosInstance.get("/dashboard/admissions/monthly-trend");

// Gender Distribution
export const getAdmissionGenderDistributionAPI = () =>
  axiosInstance.get("/dashboard/admissions/gender-distribution");
