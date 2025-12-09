"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLedgerFlowSummaryController = exports.filterPatientLedger = exports.searchPatientLedgerResults = exports.deleteLedgerEntryRecord = exports.updateLedgerEntryRecord = exports.getPatientBalanceRecord = exports.getLedgerEntryRecordById = exports.getAllPatientLedgerEntryRecords = exports.createLedgerEntryRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const patientLedgerService_1 = require("../../services/ledgerService/patientLedgerService");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../../utils/queryValidation");
exports.createLedgerEntryRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.patientLedgerSchema.parse({
        ...req.body,
        date: new Date(req.body.date),
    });
    const entry = await (0, patientLedgerService_1.createLedgerEntry)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Patient ledger entry created successfully",
        data: entry,
    });
});
exports.getAllPatientLedgerEntryRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor, limit } = req.query;
    const { data: records, nextCursor } = await (0, patientLedgerService_1.getAllPatientLedgerService)(cursor, limit ? Number(limit) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Patient ledger records fetched",
        data: records,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: limit ? Number(limit) : 50,
        },
    });
});
exports.getLedgerEntryRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const entry = await (0, patientLedgerService_1.getLedgerEntryById)(id);
    if (!entry) {
        return next(new errorHandler_1.ErrorHandler("Ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger entry details fetched",
        data: entry,
    });
});
exports.getPatientBalanceRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const patientName = req.query.patientName;
    if (!patientName) {
        return next(new errorHandler_1.ErrorHandler("Patient name is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const balance = await (0, patientLedgerService_1.getPatientBalance)(patientName);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Patient balance calculated",
        data: { patientName, balance },
    });
});
exports.updateLedgerEntryRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.patientLedgerSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
    });
    const updatedEntry = await (0, patientLedgerService_1.updateLedgerEntry)(id, validatedData);
    if (!updatedEntry) {
        return next(new errorHandler_1.ErrorHandler("Ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger entry updated successfully",
        data: updatedEntry,
    });
});
exports.deleteLedgerEntryRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEntry = await (0, patientLedgerService_1.deleteLedgerEntry)(id);
    if (!deletedEntry) {
        return next(new errorHandler_1.ErrorHandler("Ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger entry deleted successfully",
        data: deletedEntry,
    });
});
exports.searchPatientLedgerResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const results = await (0, patientLedgerService_1.searchPatientLedger)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: results,
    });
});
exports.filterPatientLedger = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.patientLedgerFilterSchema.parse(req.query);
    const { data, nextCursor } = await (0, patientLedgerService_1.filterPatientLedgerService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered patient ledger fetched",
        data,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: validated.limit,
        },
    });
});
exports.getLedgerFlowSummaryController = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const data = await (0, patientLedgerService_1.getLedgerFlowSummary)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ledger flow summary fetched successfully",
        data,
    });
});
