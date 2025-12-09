"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDoctorLedger = exports.searchDoctorLedgerResults = exports.deleteDoctorLedgerRecord = exports.updateDoctorLedgerRecord = exports.getDoctorBalanceRecord = exports.getDoctorLedgerRecordById = exports.getAllDoctorLedgerRecords = exports.createDoctorLedgerRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const doctorLedgerService_1 = require("../../services/ledgerService/doctorLedgerService");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../../utils/queryValidation");
exports.createDoctorLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.doctorLedgerSchema.parse({
        ...req.body,
        date: new Date(req.body.date),
    });
    const entry = await (0, doctorLedgerService_1.createDoctorLedgerEntry)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Doctor ledger entry created successfully",
        data: entry,
    });
});
exports.getAllDoctorLedgerRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor, limit } = req.query;
    const { data: records, nextCursor } = await (0, doctorLedgerService_1.getAllDoctorLedgerService)(cursor, limit ? Number(limit) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor ledger records fetched",
        data: records,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: limit ? Number(limit) : 50,
        },
    });
});
exports.getDoctorLedgerRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const entry = await (0, doctorLedgerService_1.getDoctorLedgerEntryById)(id);
    if (!entry) {
        return next(new errorHandler_1.ErrorHandler("Doctor ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor ledger entry details fetched",
        data: entry,
    });
});
exports.getDoctorBalanceRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const doctorName = req.query.doctorName;
    if (!doctorName) {
        return next(new errorHandler_1.ErrorHandler("Doctor name is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const balance = await (0, doctorLedgerService_1.getDoctorBalance)(doctorName);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor balance calculated",
        data: { doctorName, balance },
    });
});
exports.updateDoctorLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.doctorLedgerSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
    });
    const updatedEntry = await (0, doctorLedgerService_1.updateDoctorLedgerEntry)(id, validatedData);
    if (!updatedEntry) {
        return next(new errorHandler_1.ErrorHandler("Doctor ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor ledger entry updated successfully",
        data: updatedEntry,
    });
});
exports.deleteDoctorLedgerRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEntry = await (0, doctorLedgerService_1.deleteDoctorLedgerEntry)(id);
    if (!deletedEntry) {
        return next(new errorHandler_1.ErrorHandler("Doctor ledger entry not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor ledger entry deleted successfully",
        data: deletedEntry,
    });
});
exports.searchDoctorLedgerResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const results = await (0, doctorLedgerService_1.searchDoctorLedger)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor ledger search results fetched",
        data: results,
    });
});
exports.filterDoctorLedger = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.doctorLedgerFilterSchema.parse(req.query);
    const { data, nextCursor } = await (0, doctorLedgerService_1.filterDoctorLedgerService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered doctor ledger fetched",
        data,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: validated.limit,
        },
    });
});
