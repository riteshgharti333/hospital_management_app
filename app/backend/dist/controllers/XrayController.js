"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteXrayReportRecord = exports.updateXrayReportRecord = exports.getDoctorWiseSummaryReport = exports.getFinancialSummaryReport = exports.getXrayReportRecordById = exports.getAllXrayReportRecords = exports.createXrayReportRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const xrayService_1 = require("../services/xrayService");
const schemas_1 = require("@hospital/schemas");
exports.createXrayReportRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.xrayReportSchema.parse({
        ...req.body,
        billDate: new Date(req.body.billDate),
        testDate: new Date(req.body.testDate),
        reportDate: new Date(req.body.reportDate),
    });
    // Validate netBillAmount calculation
    const calculatedNet = validated.billAmount * (1 - validated.discountPercent / 100);
    if (Math.abs(calculatedNet - validated.netBillAmount) > 0.01) {
        return next(new errorHandler_1.ErrorHandler("Net bill amount calculation doesn't match", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    // Validate doctorEarning calculation
    const calculatedEarning = validated.netBillAmount * (validated.commissionPercent / 100);
    if (Math.abs(calculatedEarning - validated.doctorEarning) > 0.01) {
        return next(new errorHandler_1.ErrorHandler("Doctor earning calculation doesn't match", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const report = await (0, xrayService_1.createXrayReport)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "X-ray report record created successfully",
        data: report,
    });
});
exports.getAllXrayReportRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const filters = {
        patientMobile: req.query.patientMobile,
        patientName: req.query.patientName,
        referredDoctor: req.query.referredDoctor,
        startDate: req.query.startDate
            ? new Date(req.query.startDate)
            : undefined,
        endDate: req.query.endDate
            ? new Date(req.query.endDate)
            : undefined,
        department: req.query.department,
    };
    const reports = await (0, xrayService_1.getAllXrayReports)(filters);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "X-ray reports fetched successfully",
        data: reports,
    });
});
exports.getXrayReportRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const report = await (0, xrayService_1.getXrayReportById)(id);
    if (!report) {
        return next(new errorHandler_1.ErrorHandler("X-ray report not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "X-ray report details fetched",
        data: report,
    });
});
exports.getFinancialSummaryReport = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const summary = await (0, xrayService_1.getFinancialSummary)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Financial summary calculated",
        data: summary,
    });
});
exports.getDoctorWiseSummaryReport = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const summary = await (0, xrayService_1.getDoctorWiseSummary)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor-wise summary calculated",
        data: summary,
    });
});
exports.updateXrayReportRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.xrayReportSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        billDate: req.body.billDate ? new Date(req.body.billDate) : undefined,
        testDate: req.body.testDate ? new Date(req.body.testDate) : undefined,
        reportDate: req.body.reportDate
            ? new Date(req.body.reportDate)
            : undefined,
    });
    const updatedReport = await (0, xrayService_1.updateXrayReport)(id, validatedData);
    if (!updatedReport) {
        return next(new errorHandler_1.ErrorHandler("X-ray report not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "X-ray report updated successfully",
        data: updatedReport,
    });
});
exports.deleteXrayReportRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedReport = await (0, xrayService_1.deleteXrayReport)(id);
    if (!deletedReport) {
        return next(new errorHandler_1.ErrorHandler("X-ray report not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "X-ray report deleted successfully",
        data: deletedReport,
    });
});
