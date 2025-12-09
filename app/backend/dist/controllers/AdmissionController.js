"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmissionGenderAnalyticsRecord = exports.getMonthlyAdmissionTrendRecord = exports.getAdmissionAnalyticsRecord = exports.filterAdmissions = exports.searchAdmissionsResults = exports.deleteAdmission = exports.updateAdmission = exports.getAdmissionById = exports.getAllAdmissions = exports.createAdmission = void 0;
const client_1 = require("@prisma/client");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const admissionService_1 = require("../services/admissionService");
const prisma = new client_1.PrismaClient();
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../utils/queryValidation");
// CREATE
exports.createAdmission = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const validated = schemas_1.admissionSchema.parse(req.body);
        // Generate numbers BEFORE creating admission
        const year = new Date().getFullYear();
        const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
        // Get the next available ID
        const lastAdmission = await prisma.admission.findFirst({
            orderBy: { id: "desc" },
        });
        const nextId = (lastAdmission?.id || 0) + 1;
        const gsRsRegNo = `GS${year}/${nextId.toString().padStart(4, "0")}`;
        const urnNo = `URN${year}${month}${nextId.toString().padStart(3, "0")}`;
        // Create admission with all data at once
        const admission = await prisma.admission.create({
            data: {
                ...validated,
                gsRsRegNo,
                urnNo,
            },
        });
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.CREATED,
            message: "Admission created successfully",
            data: admission,
        });
    }
    catch (error) {
        next(error);
    }
});
// GET ALL
exports.getAllAdmissions = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor, limit } = req.query;
    const { data: admission, nextCursor } = await (0, admissionService_1.getAllAdmissionsService)(cursor, limit ? Number(limit) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission records fetched",
        data: admission,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: limit ? Number(limit) : 50,
        },
    });
});
// GET SINGLE BY ID
exports.getAdmissionById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const admission = await prisma.admission.findUnique({ where: { id } });
    if (!admission)
        return next(new errorHandler_1.ErrorHandler("Admission not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission details fetched",
        data: admission,
    });
});
// UPDATE
exports.updateAdmission = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    // Allow partial update
    const partialSchema = schemas_1.admissionSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedAdmission = await prisma.admission.update({
        where: { id },
        data: validatedData,
    });
    if (!updatedAdmission)
        return next(new errorHandler_1.ErrorHandler("Admission not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission updated successfully",
        data: updatedAdmission,
    });
});
// DELETE
exports.deleteAdmission = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const deletedAdmission = await prisma.admission.delete({ where: { id } });
    if (!deletedAdmission)
        return next(new errorHandler_1.ErrorHandler("Admission not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission deleted successfully",
        data: deletedAdmission,
    });
});
//////////// SEARCH ADMISSIONS
exports.searchAdmissionsResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const admissions = await (0, admissionService_1.searchAdmissions)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: admissions,
    });
});
///////////
exports.filterAdmissions = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    // Validate query params
    const validated = schemas_1.admissionFilterSchema.parse(req.query);
    // Get filtered results
    const { data, nextCursor } = await (0, admissionService_1.filterAdmissionsService)(validated);
    // Send response
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered admissions fetched",
        data,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: validated.limit || 50,
        },
    });
});
exports.getAdmissionAnalyticsRecord = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const result = await (0, admissionService_1.getAdmissionAnalytics)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Admission analytics fetched successfully",
        data: result,
    });
});
exports.getMonthlyAdmissionTrendRecord = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const result = await (0, admissionService_1.getMonthlyAdmissionTrend)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Monthly admission trend fetched successfully",
        data: result,
    });
});
exports.getAdmissionGenderAnalyticsRecord = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const result = await (0, admissionService_1.getAdmissionGenderAnalytics)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Admission gender analytics fetched successfully",
        data: result,
    });
});
