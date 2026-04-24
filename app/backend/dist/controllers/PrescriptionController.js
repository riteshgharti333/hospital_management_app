"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrescriptionsByAdmissionId = exports.filterPrescriptions = exports.searchPrescriptionResults = exports.deletePrescriptionRecord = exports.updatePrescriptionRecord = exports.uploadPrescriptionDoc = exports.getPrescriptionRecordById = exports.getAllPrescriptionRecords = exports.createPrescriptionRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const prescriptionService_1 = require("../services/prescriptionService");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../utils/queryValidation");
const paginationConfig_1 = require("../lib/paginationConfig");
const s3_service_1 = require("../aws/s3.service");
exports.createPrescriptionRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    // Parse medicines if string
    if (req.body.medicines && typeof req.body.medicines === 'string') {
        req.body.medicines = JSON.parse(req.body.medicines);
    }
    // Clean and trim string fields
    if (req.body.status) {
        req.body.status = req.body.status.trim();
    }
    if (req.body.notes) {
        req.body.notes = req.body.notes.trim();
    }
    // Remove empty fields
    if (req.body.prescriptionDate === '') {
        delete req.body.prescriptionDate;
    }
    // Ensure admissionId is a valid number
    if (!req.body.admissionId || req.body.admissionId === '') {
        return next(new errorHandler_1.ErrorHandler("Admission ID is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const admissionId = Number(req.body.admissionId);
    if (isNaN(admissionId)) {
        return next(new errorHandler_1.ErrorHandler("Admission ID must be a valid number", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    req.body.admissionId = admissionId;
    // Handle optional file upload with prescriptionDoc field
    if (req.file) {
        const { url } = await (0, s3_service_1.uploadFileToS3)(req.file);
        req.body.prescriptionDoc = url;
    }
    const validated = schemas_1.prescriptionSchema.parse(req.body);
    const prescription = await (0, prescriptionService_1.createPrescription)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Prescription created successfully",
        data: prescription,
    });
});
exports.getAllPrescriptionRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor } = req.query;
    const result = await (0, prescriptionService_1.getAllPrescriptions)(cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription records fetched",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
exports.getPrescriptionRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const prescription = await (0, prescriptionService_1.getPrescriptionById)(id);
    if (!prescription) {
        return next(new errorHandler_1.ErrorHandler("Prescription not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription details fetched",
        data: prescription,
    });
});
// In PrescriptionController.ts - Add this new endpoint
exports.uploadPrescriptionDoc = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    if (!req.file) {
        return next(new errorHandler_1.ErrorHandler("No file uploaded", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const { url } = await (0, s3_service_1.uploadFileToS3)(req.file);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "File uploaded successfully",
        data: { url },
    });
});
exports.updatePrescriptionRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    // Parse medicines if string
    if (req.body.medicines && typeof req.body.medicines === 'string') {
        req.body.medicines = JSON.parse(req.body.medicines);
    }
    // Convert admissionId to number
    if (req.body.admissionId) {
        req.body.admissionId = Number(req.body.admissionId);
    }
    // Handle optional file upload
    if (req.file) {
        const { url } = await (0, s3_service_1.uploadFileToS3)(req.file);
        req.body.prescriptionDoc = url;
    }
    const partialSchema = schemas_1.prescriptionSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedPrescription = await (0, prescriptionService_1.updatePrescription)(id, validatedData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription updated successfully",
        data: updatedPrescription,
    });
});
exports.deletePrescriptionRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedPrescription = await (0, prescriptionService_1.deletePrescription)(id);
    if (!deletedPrescription) {
        return next(new errorHandler_1.ErrorHandler("Prescription not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription deleted successfully",
        data: deletedPrescription,
    });
});
exports.searchPrescriptionResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const prescriptions = await (0, prescriptionService_1.searchPrescription)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: prescriptions,
    });
});
exports.filterPrescriptions = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const filterSchema = zod_1.z.object({
        fromDate: zod_1.z.string().datetime().optional(),
        toDate: zod_1.z.string().datetime().optional(),
        status: zod_1.z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
        admissionId: zod_1.z.coerce.number().optional(),
        cursor: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().optional(),
    });
    const validated = filterSchema.parse(req.query);
    const { data, nextCursor, hasMore } = await (0, prescriptionService_1.filterPrescriptionsService)({
        ...validated,
        fromDate: validated.fromDate ? new Date(validated.fromDate) : undefined,
        toDate: validated.toDate ? new Date(validated.toDate) : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered prescriptions fetched",
        data,
        pagination: {
            nextCursor: nextCursor || undefined,
            limit: validated.limit ?? paginationConfig_1.PAGINATION_CONFIG.DEFAULT_LIMIT,
            hasMore,
        },
    });
});
exports.getPrescriptionsByAdmissionId = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const admissionId = Number(req.params.admissionId);
    if (isNaN(admissionId)) {
        return next(new errorHandler_1.ErrorHandler("Invalid Admission ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const prescriptions = await (0, prescriptionService_1.getPrescriptionsByAdmission)(admissionId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission prescriptions fetched successfully",
        data: prescriptions,
    });
});
