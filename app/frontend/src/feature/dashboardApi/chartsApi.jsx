import axiosInstance from "../../utils/axiosInstance";

// 1. Revenue Analytics
export const getRevenueAnalyticsAPI = () =>
  axiosInstance.get("/transection/money-receipt/revenue");

// 2. Bill Status Analytics
export const getBillStatusAnalyticsAPI = () =>
  axiosInstance.get("/transection/bill/bill-status-analytics");

// 3. Patient Analytics
export const getPatientAnalyticsAPI = () =>
  axiosInstance.get("/patient/analytics");

// 4. Admission Analytics
export const getAdmissionAnalyticsAPI = () =>
  axiosInstance.get("/admission/analytics");

// 1. Monthly Admissions Trend
export const getAdmissionMonthlyTrendAPI = () =>
  axiosInstance.get("/admission/analytics/monthly-trend");

// 2. Admissions by Gender
export const getAdmissionGenderDistributionAPI = () =>
  axiosInstance.get("/admission/analytics/gender-distribution");

// 3. Age Distribution (Patients)
export const getPatientAgeDistributionAPI = () =>
  axiosInstance.get("/patient/analytics/age-distribution");


// 1️⃣ Bill Status Analytics
export const getBillMoneyStatusAnalyticsAPI = () =>
  axiosInstance.get("/transection/bill/analytics/status");

// 2️⃣ Payment Mode Breakdown
export const getPaymentModeAnalyticsAPI = () =>
  axiosInstance.get("/transection/money-receipt/analytics/payment-modes");

// 3️⃣ Billing vs Receipt Monthly Chart
export const getBillingVsReceiptAPI = () =>
  axiosInstance.get("/transection/bill/analytics/billing-vs-receipt");


export const getPatientLedgerFlowSummaryAPI = () =>
  axiosInstance.get("/ledger/patient-ledger/ledger-flow-summary");