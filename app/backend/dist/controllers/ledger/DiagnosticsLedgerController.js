"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDiagnosticsRecord = exports.updateDiagnosticsRecord = exports.getPatientDiagnosticsTotalRecord = exports.getDiagnosticsRecordById = exports.getAllDiagnosticsRecords = exports.createDiagnosticsRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const diagnosticsLedgerService_1 = require("../../services/ledgerService/diagnosticsLedgerService");
const schemas_1 = require("@hospital/schemas");
exports.createDiagnosticsRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.diagnosticsLedgerSchema.parse({
        ...req.body,
        date: new Date(req.body.date)
    });
    const entry = await (0, diagnosticsLedgerService_1.createDiagnosticsEntry)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Diagnostics record created successfully",
        data: entry,
    });
});
exports.getAllDiagnosticsRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const filters = {
        patientName: req.query.patientName,
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
        testName: req.query.testName
    };
    const entries = await (0, diagnosticsLedgerService_1.getAllDiagnosticsEntries)(filters);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Diagnostics records fetched successfully",
        data: entries,
    });
});
exports.getDiagnosticsRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const entry = await (0, diagnosticsLedgerService_1.getDiagnosticsEntryById)(id);
    if (!entry) {
        return next(new errorHandler_1.ErrorHandler("Diagnostics record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Diagnostics record details fetched",
        data: entry,
    });
});
exports.getPatientDiagnosticsTotalRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const patientName = req.query.patientName;
    if (!patientName) {
        return next(new errorHandler_1.ErrorHandler("Patient name is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const total = await (0, diagnosticsLedgerService_1.getPatientDiagnosticsTotal)(patientName);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Patient diagnostics total calculated",
        data: { patientName, total },
    });
});
exports.updateDiagnosticsRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.diagnosticsLedgerSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined
    });
    const updatedEntry = await (0, diagnosticsLedgerService_1.updateDiagnosticsEntry)(id, validatedData);
    if (!updatedEntry) {
        return next(new errorHandler_1.ErrorHandler("Diagnostics record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Diagnostics record updated successfully",
        data: updatedEntry,
    });
});
exports.deleteDiagnosticsRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEntry = await (0, diagnosticsLedgerService_1.deleteDiagnosticsEntry)(id);
    if (!deletedEntry) {
        return next(new errorHandler_1.ErrorHandler("Diagnostics record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Diagnostics record deleted successfully",
        data: deletedEntry,
    });
});
