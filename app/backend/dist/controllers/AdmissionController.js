"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAdmissions = exports.searchAdmissionsResults = exports.deleteAdmission = exports.updateAdmission = exports.getAdmissionById = exports.getAllAdmissions = exports.createAdmission = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const admissionService_1 = require("../services/admissionService");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../utils/queryValidation");
const prisma_1 = require("../lib/prisma");
// CREATE
exports.createAdmission = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    // 1️⃣ Validate body
    const validated = schemas_1.admissionSchema.parse(req.body);
    // 3️⃣ Create admission (DB + ID handled in service)
    const admission = await (0, admissionService_1.createAdmissionService)(validated);
    // 4️⃣ Send response
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Admission created successfully",
        data: admission,
    });
});
// GET ALL
exports.getAllAdmissions = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor } = req.query;
    const result = await (0, admissionService_1.getAllAdmissionsService)(cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission records fetched",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
// GET SINGLE BY ID
exports.getAdmissionById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const admission = await prisma_1.prisma.admission.findUnique({ where: { id } });
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
    const updatedAdmission = await prisma_1.prisma.admission.update({
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
    const deletedAdmission = await prisma_1.prisma.admission.delete({ where: { id } });
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
    const { query, cursor } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const result = await (0, admissionService_1.searchAdmissions)(searchTerm, cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
/////////// FILTER ADMISSIONS
exports.filterAdmissions = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.admissionFilterSchema.parse(req.query);
    const { data, nextCursor, hasMore } = await (0, admissionService_1.filterAdmissionsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered admissions fetched",
        data,
        pagination: {
            nextCursor: nextCursor || undefined,
            hasMore,
        },
    });
});
