"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDoctors = exports.searchDoctorResults = exports.deleteDoctorRecord = exports.updateDoctorRecord = exports.getDoctorRecordById = exports.getAllDoctorRecords = exports.createDoctorRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const doctorService_1 = require("../services/doctorService");
const schemas_1 = require("@hospital/schemas");
const library_1 = require("@prisma/client/runtime/library");
const queryValidation_1 = require("../utils/queryValidation");
const paginationConfig_1 = require("../lib/paginationConfig");
exports.createDoctorRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.doctorSchema.parse(req.body);
    const existingDoctor = await (0, doctorService_1.getDoctorByEmail)(validated.email);
    if (existingDoctor) {
        return next(new errorHandler_1.ErrorHandler("Doctor with this email already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const doctor = await (0, doctorService_1.createDoctor)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Doctor created successfully",
        data: doctor,
    });
});
exports.getAllDoctorRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor } = req.query;
    const result = await (0, doctorService_1.getAllDoctors)(cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor records fetched",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
exports.getDoctorRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const doctor = await (0, doctorService_1.getDoctorById)(id);
    if (!doctor) {
        return next(new errorHandler_1.ErrorHandler("Doctor not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor details fetched",
        data: doctor,
    });
});
exports.updateDoctorRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.doctorSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // 🔍 Email uniqueness check (Doctor table)
    if (validatedData.email) {
        const existingDoctor = await (0, doctorService_1.getDoctorByEmail)(validatedData.email);
        if (existingDoctor && existingDoctor.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another doctor with this email already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedDoctor = await (0, doctorService_1.updateDoctor)(id, validatedData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor updated successfully",
        data: updatedDoctor,
    });
});
exports.deleteDoctorRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    try {
        const deletedDoctor = await (0, doctorService_1.deleteDoctor)(id);
        if (!deletedDoctor) {
            return next(new errorHandler_1.ErrorHandler("Doctor not found", statusCodes_1.StatusCodes.NOT_FOUND));
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.OK,
            message: "Doctor and access deleted successfully",
            data: deletedDoctor,
        });
    }
    catch (error) {
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === "P2003") {
            return next(new errorHandler_1.ErrorHandler("Cannot delete doctor: Prescriptions or admissions linked to this doctor exist.", statusCodes_1.StatusCodes.CONFLICT));
        }
        return next(new errorHandler_1.ErrorHandler("An error occurred while deleting doctor", statusCodes_1.StatusCodes.INTERNAL_ERROR));
    }
});
exports.searchDoctorResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const doctors = await (0, doctorService_1.searchDoctor)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: doctors,
    });
});
exports.filterDoctors = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.doctorFilterSchema.parse(req.query);
    const { data, nextCursor, hasMore } = await (0, doctorService_1.filterDoctorsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered doctors fetched",
        data,
        pagination: {
            nextCursor: nextCursor || undefined,
            limit: validated.limit ?? paginationConfig_1.PAGINATION_CONFIG.DEFAULT_LIMIT,
            hasMore,
        },
    });
});
