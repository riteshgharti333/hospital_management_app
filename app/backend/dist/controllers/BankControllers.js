"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBankAccounts = exports.searchBankAccountResults = exports.deleteBankAccountRecord = exports.updateBankAccountRecord = exports.getBankAccountRecordById = exports.getAllBankAccountRecords = exports.createBankAccountRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const bankService_1 = require("../services/bankService");
const schemas_1 = require("@hospital/schemas");
const library_1 = require("@prisma/client/runtime/library");
const queryValidation_1 = require("../utils/queryValidation");
const paginationConfig_1 = require("../lib/paginationConfig");
exports.createBankAccountRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.bankSchema.parse(req.body);
    const existingBankAccount = await (0, bankService_1.getBankAccountByAccountNo)(validated.accountNo);
    if (existingBankAccount) {
        return next(new errorHandler_1.ErrorHandler("Bank account with this account number already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const bankAccount = await (0, bankService_1.createBankAccount)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Bank account created successfully",
        data: bankAccount,
    });
});
exports.getAllBankAccountRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor } = req.query;
    const result = await (0, bankService_1.getAllBankAccounts)(cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bank account records fetched",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
exports.getBankAccountRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const bankAccount = await (0, bankService_1.getBankAccountById)(id);
    if (!bankAccount) {
        return next(new errorHandler_1.ErrorHandler("Bank account not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bank account details fetched",
        data: bankAccount,
    });
});
exports.updateBankAccountRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.bankSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // Account number uniqueness check
    if (validatedData.accountNo) {
        const existingBankAccount = await (0, bankService_1.getBankAccountByAccountNo)(validatedData.accountNo);
        if (existingBankAccount && existingBankAccount.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another bank account with this account number already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedBankAccount = await (0, bankService_1.updateBankAccount)(id, validatedData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bank account updated successfully",
        data: updatedBankAccount,
    });
});
exports.deleteBankAccountRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    try {
        const deletedBankAccount = await (0, bankService_1.deleteBankAccount)(id);
        if (!deletedBankAccount) {
            return next(new errorHandler_1.ErrorHandler("Bank account not found", statusCodes_1.StatusCodes.NOT_FOUND));
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.OK,
            message: "Bank account deleted successfully",
            data: deletedBankAccount,
        });
    }
    catch (error) {
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === "P2003") {
            return next(new errorHandler_1.ErrorHandler("Cannot delete bank account: Transactions linked to this account exist.", statusCodes_1.StatusCodes.CONFLICT));
        }
        return next(new errorHandler_1.ErrorHandler("An error occurred while deleting bank account", statusCodes_1.StatusCodes.INTERNAL_ERROR));
    }
});
exports.searchBankAccountResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const bankAccounts = await (0, bankService_1.searchBankAccount)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: bankAccounts,
    });
});
exports.filterBankAccounts = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.bankFilterSchema.parse(req.query);
    const { data, nextCursor, hasMore } = await (0, bankService_1.filterBankAccountsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered bank accounts fetched",
        data,
        pagination: {
            nextCursor: nextCursor || undefined,
            limit: validated.limit ?? paginationConfig_1.PAGINATION_CONFIG.DEFAULT_LIMIT,
            hasMore,
        },
    });
});
