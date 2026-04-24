"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterLedgers = exports.searchLedgerResultsByEntity = exports.deleteLedgerRecord = exports.updateLedgerRecord = exports.getLedgersByEntityRecord = exports.getLedgerRecordById = exports.getAllLedgerRecords = exports.createLedgerRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const ledgerService_1 = require("../services/ledgerService");
const schemas_1 = require("@hospital/schemas");
const library_1 = require("@prisma/client/runtime/library");
const queryValidation_1 = require("../utils/queryValidation");
const paginationConfig_1 = require("../lib/paginationConfig");
exports.createLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.ledgerSchema.parse(req.body);
    const ledger = await (0, ledgerService_1.createLedger)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Ledger entry created successfully",
        data: ledger,
    });
});
exports.getAllLedgerRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor } = req.query;
    const result = await (0, ledgerService_1.getAllLedgers)(cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger records fetched",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
exports.getLedgerRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const ledger = await (0, ledgerService_1.getLedgerById)(id);
    if (!ledger) {
        return next(new errorHandler_1.ErrorHandler("Ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger details fetched",
        data: ledger,
    });
});
exports.getLedgersByEntityRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { entityType } = req.params;
    // Fix: Ensure entityType is a string
    const entityTypeStr = Array.isArray(entityType)
        ? entityType[0]
        : entityType;
    const ledgers = await (0, ledgerService_1.getLedgersByEntity)(entityTypeStr);
    const balance = await (0, ledgerService_1.getCurrentBalance)(entityTypeStr);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Entity ledger entries fetched",
        data: {
            transactions: ledgers,
            currentBalance: balance,
        },
    });
});
exports.updateLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.ledgerSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedLedger = await (0, ledgerService_1.updateLedger)(id, validatedData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger entry updated successfully",
        data: updatedLedger,
    });
});
exports.deleteLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    try {
        const deletedLedger = await (0, ledgerService_1.deleteLedger)(id);
        if (!deletedLedger) {
            return next(new errorHandler_1.ErrorHandler("Ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.OK,
            message: "Ledger entry deleted successfully",
            data: deletedLedger,
        });
    }
    catch (error) {
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === "P2003") {
            return next(new errorHandler_1.ErrorHandler("Cannot delete ledger entry: Related records exist.", statusCodes_1.StatusCodes.CONFLICT));
        }
        return next(new errorHandler_1.ErrorHandler("An error occurred while deleting ledger entry", statusCodes_1.StatusCodes.INTERNAL_ERROR));
    }
});
exports.searchLedgerResultsByEntity = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const { entityType } = req.params;
    const entityTypeString = Array.isArray(entityType) ? entityType[0] : entityType;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    // Get search results
    const allResults = await (0, ledgerService_1.searchLedger)(searchTerm);
    // Filter by entityType
    const filteredResults = allResults.filter((ledger) => ledger.entityType === entityTypeString);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: `Search results fetched successfully for ${entityTypeString} ledgers`,
        data: filteredResults,
    });
});
exports.filterLedgers = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { entityType } = req.params;
    const entityTypeString = Array.isArray(entityType) ? entityType[0] : entityType;
    const validated = schemas_1.ledgerFilterSchema.parse(req.query);
    const { data, nextCursor, hasMore } = await (0, ledgerService_1.filterLedgersService)(validated, entityTypeString);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered ledger entries fetched",
        data,
        pagination: {
            nextCursor: nextCursor || undefined,
            limit: validated.limit ?? paginationConfig_1.PAGINATION_CONFIG.DEFAULT_LIMIT,
            hasMore,
        },
    });
});
