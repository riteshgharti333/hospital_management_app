"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterCashAccounts = exports.searchCashAccountResults = exports.deleteCashAccountRecord = exports.updateCashAccountRecord = exports.getCashAccountRecordById = exports.getAllCashAccountRecords = exports.createCashAccountRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const cashService_1 = require("../services/cashService");
const schemas_1 = require("@hospital/schemas");
const library_1 = require("@prisma/client/runtime/library");
const queryValidation_1 = require("../utils/queryValidation");
const paginationConfig_1 = require("../lib/paginationConfig");
exports.createCashAccountRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.cashSchema.parse(req.body);
    const existingCashAccount = await (0, cashService_1.getCashAccountByName)(validated.cashName);
    if (existingCashAccount) {
        return next(new errorHandler_1.ErrorHandler("Cash account with this name already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const cashAccount = await (0, cashService_1.createCashAccount)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Cash account created successfully",
        data: cashAccount,
    });
});
exports.getAllCashAccountRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor } = req.query;
    const result = await (0, cashService_1.getAllCashAccounts)(cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Cash account records fetched",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
exports.getCashAccountRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const cashAccount = await (0, cashService_1.getCashAccountById)(id);
    if (!cashAccount) {
        return next(new errorHandler_1.ErrorHandler("Cash account not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Cash account details fetched",
        data: cashAccount,
    });
});
exports.updateCashAccountRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.cashSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // Name uniqueness check
    if (validatedData.cashName) {
        const existingCashAccount = await (0, cashService_1.getCashAccountByName)(validatedData.cashName);
        if (existingCashAccount && existingCashAccount.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another cash account with this name already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedCashAccount = await (0, cashService_1.updateCashAccount)(id, validatedData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Cash account updated successfully",
        data: updatedCashAccount,
    });
});
exports.deleteCashAccountRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    try {
        const deletedCashAccount = await (0, cashService_1.deleteCashAccount)(id);
        if (!deletedCashAccount) {
            return next(new errorHandler_1.ErrorHandler("Cash account not found", statusCodes_1.StatusCodes.NOT_FOUND));
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.OK,
            message: "Cash account deleted successfully",
            data: deletedCashAccount,
        });
    }
    catch (error) {
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === "P2003") {
            return next(new errorHandler_1.ErrorHandler("Cannot delete cash account: Transactions linked to this account exist.", statusCodes_1.StatusCodes.CONFLICT));
        }
        return next(new errorHandler_1.ErrorHandler("An error occurred while deleting cash account", statusCodes_1.StatusCodes.INTERNAL_ERROR));
    }
});
exports.searchCashAccountResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const cashAccounts = await (0, cashService_1.searchCashAccount)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: cashAccounts,
    });
});
exports.filterCashAccounts = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.cashFilterSchema.parse(req.query);
    const { data, nextCursor, hasMore } = await (0, cashService_1.filterCashAccountsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered cash accounts fetched",
        data,
        pagination: {
            nextCursor: nextCursor || undefined,
            limit: validated.limit ?? paginationConfig_1.PAGINATION_CONFIG.DEFAULT_LIMIT,
            hasMore,
        },
    });
});
