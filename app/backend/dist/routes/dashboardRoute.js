"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DashboardController_1 = require("../controllers/DashboardController");
const router = express_1.default.Router();
// Revenue & Finance
router.get("/revenue/summary", DashboardController_1.getRevenueAnalyticsData);
router.get("/revenue/payment-modes", DashboardController_1.getPaymentModeBreakdown);
router.get("/revenue/billing-vs-receipt", DashboardController_1.getMonthlyBillingVsReceiptRecord);
router.get("/ledger/flow-summary", DashboardController_1.getLedgerFlowSummaryController);
// Billing
router.get("/billing/status-breakdown", DashboardController_1.getBillStatusAnalyticsRecord);
router.get("/billing/status-summary", DashboardController_1.getBillsByStatus);
// Patients
router.get("/patients/overview", DashboardController_1.getPatientAnalyticsRecord);
router.get("/patients/age-distribution", DashboardController_1.getPatientAgeDistributionRecord);
// Admissions
router.get("/admissions/overview", DashboardController_1.getAdmissionAnalyticsRecord);
router.get("/admissions/monthly-trend", DashboardController_1.getMonthlyAdmissionTrendRecord);
router.get("/admissions/gender-distribution", DashboardController_1.getAdmissionGenderAnalyticsRecord);
exports.default = router;
