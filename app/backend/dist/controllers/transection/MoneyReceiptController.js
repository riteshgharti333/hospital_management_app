"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterMoneyReceipts = exports.searchMoneyReceiptResults = exports.deleteMoneyReceiptRecord = exports.updateMoneyReceiptRecord = exports.getMoneyReceiptRecordById = exports.getAllMoneyReceiptRecords = exports.createMoneyReceiptRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const moneyReceiptService_1 = require("../../services/transectionService/moneyReceiptService");
const paginationConfig_1 = require("../../lib/paginationConfig");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../../utils/queryValidation");
exports.createMoneyReceiptRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.moneyReceiptSchema.parse(req.body);
    const moneyReceipt = await (0, moneyReceiptService_1.createMoneyReceipt)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Money receipt created successfully",
        data: moneyReceipt,
    });
});
exports.getAllMoneyReceiptRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor } = req.query;
    const result = await (0, moneyReceiptService_1.getAllMoneyReceiptsService)(cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Money receipt records fetched",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
exports.getMoneyReceiptRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const moneyReceipt = await (0, moneyReceiptService_1.getMoneyReceiptById)(id);
    if (!moneyReceipt) {
        return next(new errorHandler_1.ErrorHandler("Money receipt not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Money receipt details fetched",
        data: moneyReceipt,
    });
});
exports.updateMoneyReceiptRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.moneyReceiptSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedMoneyReceipt = await (0, moneyReceiptService_1.updateMoneyReceipt)(id, validatedData);
    if (!updatedMoneyReceipt) {
        return next(new errorHandler_1.ErrorHandler("Money receipt not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Money receipt updated successfully",
        data: updatedMoneyReceipt,
    });
});
exports.deleteMoneyReceiptRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedMoneyReceipt = await (0, moneyReceiptService_1.deleteMoneyReceipt)(id);
    if (!deletedMoneyReceipt) {
        return next(new errorHandler_1.ErrorHandler("Money receipt not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Money receipt deleted successfully",
        data: deletedMoneyReceipt,
    });
});
exports.searchMoneyReceiptResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const receipts = await (0, moneyReceiptService_1.searchMoneyReceipts)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: receipts,
    });
});
exports.filterMoneyReceipts = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.moneyReceiptFilterSchema.parse(req.query);
    const { data, nextCursor, hasMore } = await (0, moneyReceiptService_1.filterMoneyReceiptsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered money receipts fetched",
        data,
        pagination: {
            nextCursor: nextCursor || undefined,
            limit: validated.limit ?? paginationConfig_1.PAGINATION_CONFIG.DEFAULT_LIMIT,
            hasMore,
        },
    });
});
