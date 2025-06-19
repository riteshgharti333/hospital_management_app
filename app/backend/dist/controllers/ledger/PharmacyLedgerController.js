"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePharmacyLedgerRecord = exports.updatePharmacyLedgerRecord = exports.getPharmacyCategorySummary = exports.getPharmacyFinancialSummary = exports.getPharmacyLedgerRecordById = exports.getAllPharmacyLedgerRecords = exports.createPharmacyLedgerRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const pharmacyLedgerService_1 = require("../../services/ledgerService/pharmacyLedgerService");
const schemas_1 = require("@hospital/schemas");
exports.createPharmacyLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.pharmacyLedgerSchema.parse({
        ...req.body,
        date: new Date(req.body.date),
    });
    const entry = await (0, pharmacyLedgerService_1.createPharmacyLedgerEntry)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Pharmacy ledger record created successfully",
        data: entry,
    });
});
exports.getAllPharmacyLedgerRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const filters = {
        startDate: req.query.startDate
            ? new Date(req.query.startDate)
            : undefined,
        endDate: req.query.endDate
            ? new Date(req.query.endDate)
            : undefined,
        medicineName: req.query.medicineName,
        category: req.query.category,
        amountType: req.query.amountType,
    };
    const entries = await (0, pharmacyLedgerService_1.getAllPharmacyLedgerEntries)(filters);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Pharmacy ledger records fetched successfully",
        data: entries,
    });
});
exports.getPharmacyLedgerRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const entry = await (0, pharmacyLedgerService_1.getPharmacyLedgerEntryById)(id);
    if (!entry) {
        return next(new errorHandler_1.ErrorHandler("Pharmacy ledger record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Pharmacy ledger record details fetched",
        data: entry,
    });
});
exports.getPharmacyFinancialSummary = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const summary = await (0, pharmacyLedgerService_1.getPharmacySummary)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Pharmacy financial summary calculated",
        data: summary,
    });
});
exports.getPharmacyCategorySummary = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const summary = await (0, pharmacyLedgerService_1.getCategoryWiseSummary)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Pharmacy category-wise summary calculated",
        data: summary,
    });
});
exports.updatePharmacyLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.pharmacyLedgerSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
    });
    const updatedEntry = await (0, pharmacyLedgerService_1.updatePharmacyLedgerEntry)(id, validatedData);
    if (!updatedEntry) {
        return next(new errorHandler_1.ErrorHandler("Pharmacy ledger record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Pharmacy ledger record updated successfully",
        data: updatedEntry,
    });
});
exports.deletePharmacyLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEntry = await (0, pharmacyLedgerService_1.deletePharmacyLedgerEntry)(id);
    if (!deletedEntry) {
        return next(new errorHandler_1.ErrorHandler("Pharmacy ledger record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Pharmacy ledger record deleted successfully",
        data: deletedEntry,
    });
});
