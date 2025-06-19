"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBankLedgerRecord = exports.updateBankLedgerRecord = exports.getBankBalanceRecord = exports.getBankLedgerRecordById = exports.getAllBankLedgerRecords = exports.createBankLedgerRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const bankLedgerService_1 = require("../../services/ledgerService/bankLedgerService");
const schemas_1 = require("@hospital/schemas");
exports.createBankLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.bankLedgerSchema.parse({
        ...req.body,
        date: new Date(req.body.date)
    });
    const entry = await (0, bankLedgerService_1.createBankLedgerEntry)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Bank ledger entry created successfully",
        data: entry,
    });
});
exports.getAllBankLedgerRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const filters = {
        bankName: req.query.bankName,
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
        amountType: req.query.amountType
    };
    const entries = await (0, bankLedgerService_1.getAllBankLedgerEntries)(filters);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bank ledger entries fetched successfully",
        data: entries,
    });
});
exports.getBankLedgerRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const entry = await (0, bankLedgerService_1.getBankLedgerEntryById)(id);
    if (!entry) {
        return next(new errorHandler_1.ErrorHandler("Bank ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bank ledger entry details fetched",
        data: entry,
    });
});
exports.getBankBalanceRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const bankName = req.query.bankName;
    if (!bankName) {
        return next(new errorHandler_1.ErrorHandler("Bank name is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const balance = await (0, bankLedgerService_1.getBankBalance)(bankName);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bank balance calculated",
        data: { bankName, balance },
    });
});
exports.updateBankLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.bankLedgerSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined
    });
    const updatedEntry = await (0, bankLedgerService_1.updateBankLedgerEntry)(id, validatedData);
    if (!updatedEntry) {
        return next(new errorHandler_1.ErrorHandler("Bank ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bank ledger entry updated successfully",
        data: updatedEntry,
    });
});
exports.deleteBankLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEntry = await (0, bankLedgerService_1.deleteBankLedgerEntry)(id);
    if (!deletedEntry) {
        return next(new errorHandler_1.ErrorHandler("Bank ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bank ledger entry deleted successfully",
        data: deletedEntry,
    });
});
