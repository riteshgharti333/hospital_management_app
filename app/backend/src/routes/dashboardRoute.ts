import express from "express";
import {
  getRevenueAnalyticsData,
  getPaymentModeBreakdown,
  getMonthlyBillingVsReceiptRecord,
  getLedgerFlowSummaryController,
  getBillStatusAnalyticsRecord,
  getBillsByStatus,
  getPatientAnalyticsRecord,
  getPatientAgeDistributionRecord,
  getAdmissionAnalyticsRecord,
  getMonthlyAdmissionTrendRecord,
  getAdmissionGenderAnalyticsRecord,
} from "../controllers/DashboardController";

const router = express.Router();

// Revenue & Finance
router.get("/revenue/summary", getRevenueAnalyticsData);
router.get("/revenue/payment-modes", getPaymentModeBreakdown);
router.get("/revenue/billing-vs-receipt", getMonthlyBillingVsReceiptRecord);
router.get("/ledger/flow-summary", getLedgerFlowSummaryController);

// Billing
router.get("/billing/status-breakdown", getBillStatusAnalyticsRecord);
router.get("/billing/status-summary", getBillsByStatus);

// Patients
router.get("/patients/overview", getPatientAnalyticsRecord);
router.get("/patients/age-distribution", getPatientAgeDistributionRecord);

// Admissions
router.get("/admissions/overview", getAdmissionAnalyticsRecord);
router.get("/admissions/monthly-trend", getMonthlyAdmissionTrendRecord);
router.get(
  "/admissions/gender-distribution",
  getAdmissionGenderAnalyticsRecord
);

export default router;
