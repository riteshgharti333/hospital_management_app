"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBillsByStatus = exports.getMonthlyBillingVsReceiptRecord = exports.getBillStatusAnalyticsRecord = exports.filterBills = exports.searchBillsResults = exports.deleteBillRecord = exports.updateBillRecord = exports.getBillRecordById = exports.getAllBillRecords = exports.createBillRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const billService_1 = require("../../services/transectionService/billService");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../../utils/queryValidation");
exports.createBillRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.billSchema.parse(req.body);
    const bill = await (0, billService_1.createBill)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Bill created successfully",
        data: bill,
    });
});
exports.getAllBillRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor, limit } = req.query;
    const { data: bills, nextCursor } = await (0, billService_1.getAllBillsService)(cursor, limit ? Number(limit) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bill records fetched",
        data: bills,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: limit ? Number(limit) : 50,
        },
    });
});
exports.getBillRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const bill = await (0, billService_1.getBillById)(id);
    if (!bill) {
        return next(new errorHandler_1.ErrorHandler("Bill not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bill details fetched",
        data: bill,
    });
});
exports.updateBillRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const partialSchema = schemas_1.billSchema.partial();
    const validated = partialSchema.parse(req.body);
    // Transform data to match updateBill expectations
    const updateData = {
        ...validated,
        dischargeDate: validated.dischargeDate ?? undefined,
        billItems: validated.billItems ?? undefined,
    };
    const updatedBill = await (0, billService_1.updateBill)(id, updateData);
    if (!updatedBill) {
        return next(new errorHandler_1.ErrorHandler("Bill not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bill updated successfully",
        data: updatedBill,
    });
});
exports.deleteBillRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedBill = await (0, billService_1.deleteBill)(id);
    if (!deletedBill) {
        return next(new errorHandler_1.ErrorHandler("Bill not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bill deleted successfully",
        data: deletedBill,
    });
});
exports.searchBillsResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const results = await (0, billService_1.searchBills)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Bill search results fetched",
        data: results,
    });
});
exports.filterBills = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.billFilterSchema.parse(req.query);
    const { data, nextCursor } = await (0, billService_1.filterBillsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Filtered bills fetched",
        data,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: validated.limit || 50,
        },
    });
});
exports.getBillStatusAnalyticsRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const data = await (0, billService_1.getBillStatusAnalytics)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Bill status analytics fetched successfully",
        data,
    });
});
exports.getMonthlyBillingVsReceiptRecord = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const data = await (0, billService_1.getMonthlyBillingVsReceipt)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Monthly billing vs receipt fetched successfully",
        data,
    });
});
exports.getBillsByStatus = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const result = await (0, billService_1.getBillsByStatusAnalytics)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Bills by status analytics fetched successfully",
        data: result,
    });
});
