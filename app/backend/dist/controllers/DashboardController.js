"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLedgerFlowSummaryController = exports.getAdmissionGenderAnalyticsRecord = exports.getMonthlyAdmissionTrendRecord = exports.getAdmissionAnalyticsRecord = exports.getPatientAgeDistributionRecord = exports.getPatientAnalyticsRecord = exports.getBillsByStatus = exports.getMonthlyBillingVsReceiptRecord = exports.getBillStatusAnalyticsRecord = exports.getPaymentModeBreakdown = exports.getRevenueAnalyticsData = void 0;
const statusCodes_1 = require("../constants/statusCodes");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const dashboardService_1 = require("../services/dashboardService");
const sendResponse_1 = require("../utils/sendResponse");
exports.getRevenueAnalyticsData = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const revenue = await (0, dashboardService_1.getRevenueAnalytics)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Revenue analytics fetched successfully",
        data: revenue,
    });
});
exports.getPaymentModeBreakdown = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const data = await (0, dashboardService_1.getPaymentModeBreakdownAnalytics)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Payment mode breakdown fetched successfully",
        data,
    });
});
exports.getBillStatusAnalyticsRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const data = await (0, dashboardService_1.getBillStatusAnalytics)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bill status analytics fetched successfully",
        data,
    });
});
exports.getMonthlyBillingVsReceiptRecord = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const data = await (0, dashboardService_1.getMonthlyBillingVsReceipt)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Monthly billing vs receipt fetched successfully",
        data,
    });
});
exports.getBillsByStatus = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const result = await (0, dashboardService_1.getBillsByStatusAnalytics)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bills by status analytics fetched successfully",
        data: result,
    });
});
exports.getPatientAnalyticsRecord = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const result = await (0, dashboardService_1.getPatientAnalytics)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Patient analytics fetched successfully",
        data: result,
    });
});
exports.getPatientAgeDistributionRecord = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const result = await (0, dashboardService_1.getPatientAgeDistribution)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Patient age distribution fetched successfully",
        data: result,
    });
});
exports.getAdmissionAnalyticsRecord = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const result = await (0, dashboardService_1.getAdmissionAnalytics)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission analytics fetched successfully",
        data: result,
    });
});
exports.getMonthlyAdmissionTrendRecord = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const result = await (0, dashboardService_1.getMonthlyAdmissionTrend)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Monthly admission trend fetched successfully",
        data: result,
    });
});
exports.getAdmissionGenderAnalyticsRecord = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const result = await (0, dashboardService_1.getAdmissionGenderAnalytics)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission gender analytics fetched successfully",
        data: result,
    });
});
exports.getLedgerFlowSummaryController = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const data = await (0, dashboardService_1.getLedgerFlowSummary)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger flow summary fetched successfully",
        data,
    });
});
