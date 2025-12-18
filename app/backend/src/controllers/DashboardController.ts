import { StatusCodes } from "../constants/statusCodes";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import {
  getAdmissionAnalytics,
  getAdmissionGenderAnalytics,
  getBillsByStatusAnalytics,
  getBillStatusAnalytics,
  getLedgerFlowSummary,
  getMonthlyAdmissionTrend,
  getMonthlyBillingVsReceipt,
  getPatientAgeDistribution,
  getPatientAnalytics,
  getPaymentModeBreakdownAnalytics,
  getRevenueAnalytics,
} from "../services/dashboardService";
import { sendResponse } from "../utils/sendResponse";

export const getRevenueAnalyticsData = catchAsyncError(async (req, res) => {
  const revenue = await getRevenueAnalytics();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Revenue analytics fetched successfully",
    data: revenue,
  });
});

export const getPaymentModeBreakdown = catchAsyncError(async (_req, res) => {
  const data = await getPaymentModeBreakdownAnalytics();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Payment mode breakdown fetched successfully",
    data,
  });
});

export const getBillStatusAnalyticsRecord = catchAsyncError(
  async (req, res) => {
    const data = await getBillStatusAnalytics();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bill status analytics fetched successfully",
      data,
    });
  }
);

export const getMonthlyBillingVsReceiptRecord = catchAsyncError(
  async (_req, res) => {
    const data = await getMonthlyBillingVsReceipt();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Monthly billing vs receipt fetched successfully",
      data,
    });
  }
);

export const getBillsByStatus = catchAsyncError(async (_req, res) => {
  const result = await getBillsByStatusAnalytics();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Bills by status analytics fetched successfully",
    data: result,
  });
});

export const getPatientAnalyticsRecord = catchAsyncError(async (_req, res) => {
  const result = await getPatientAnalytics();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Patient analytics fetched successfully",
    data: result,
  });
});

export const getPatientAgeDistributionRecord = catchAsyncError(
  async (_req, res) => {
    const result = await getPatientAgeDistribution();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Patient age distribution fetched successfully",
      data: result,
    });
  }
);

export const getAdmissionAnalyticsRecord = catchAsyncError(
  async (_req, res) => {
    const result = await getAdmissionAnalytics();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission analytics fetched successfully",
      data: result,
    });
  }
);

export const getMonthlyAdmissionTrendRecord = catchAsyncError(
  async (_req, res) => {
    const result = await getMonthlyAdmissionTrend();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Monthly admission trend fetched successfully",
      data: result,
    });
  }
);

export const getAdmissionGenderAnalyticsRecord = catchAsyncError(
  async (_req, res) => {
    const result = await getAdmissionGenderAnalytics();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission gender analytics fetched successfully",
      data: result,
    });
  }
);

export const getLedgerFlowSummaryController = catchAsyncError(
  async (_req, res) => {
    const data = await getLedgerFlowSummary();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ledger flow summary fetched successfully",
      data,
    });
  }
);
