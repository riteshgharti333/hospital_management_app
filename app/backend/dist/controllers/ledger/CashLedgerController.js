"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCashLedgerRecord = exports.updateCashLedgerRecord = exports.getCashBalanceRecord = exports.getCashLedgerRecordById = exports.getAllCashLedgerRecords = exports.createCashLedgerRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const cashLedgerService_1 = require("../../services/ledgerService/cashLedgerService");
const schemas_1 = require("@hospital/schemas");
exports.createCashLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.cashLedgerSchema.parse({
        ...req.body,
        date: new Date(req.body.date)
    });
    const entry = await (0, cashLedgerService_1.createCashLedgerEntry)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Cash ledger entry created successfully",
        data: entry,
    });
});
exports.getAllCashLedgerRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const filters = {
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
        amountType: req.query.amountType
    };
    const entries = await (0, cashLedgerService_1.getAllCashLedgerEntries)(filters);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Cash ledger entries fetched successfully",
        data: entries,
    });
});
exports.getCashLedgerRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const entry = await (0, cashLedgerService_1.getCashLedgerEntryById)(id);
    if (!entry) {
        return next(new errorHandler_1.ErrorHandler("Cash ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Cash ledger entry details fetched",
        data: entry,
    });
});
exports.getCashBalanceRecord = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const balance = await (0, cashLedgerService_1.getCashBalance)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Current cash balance calculated",
        data: { balance },
    });
});
exports.updateCashLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.cashLedgerSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined
    });
    const updatedEntry = await (0, cashLedgerService_1.updateCashLedgerEntry)(id, validatedData);
    if (!updatedEntry) {
        return next(new errorHandler_1.ErrorHandler("Cash ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Cash ledger entry updated successfully",
        data: updatedEntry,
    });
});
exports.deleteCashLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEntry = await (0, cashLedgerService_1.deleteCashLedgerEntry)(id);
    if (!deletedEntry) {
        return next(new errorHandler_1.ErrorHandler("Cash ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Cash ledger entry deleted successfully",
        data: deletedEntry,
    });
});
