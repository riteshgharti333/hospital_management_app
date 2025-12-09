"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterNurses = exports.searchNurseResults = exports.deleteNurseRecord = exports.updateNurseRecord = exports.getNurseRecordById = exports.getAllNurseRecords = exports.createNurseRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const nurseService_1 = require("../services/nurseService");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../utils/queryValidation");
exports.createNurseRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.nurseSchema.parse(req.body);
    // 🔍 Check email uniqueness
    const existingEmail = await (0, nurseService_1.getNurseByEmail)(validated.email);
    if (existingEmail) {
        return next(new errorHandler_1.ErrorHandler("Nurse with this email already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const nurse = await (0, nurseService_1.createNurse)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Nurse created successfully",
        data: nurse,
    });
});
exports.getAllNurseRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor, limit } = req.query;
    const { data: nurse, nextCursor } = await (0, nurseService_1.getAllNurses)(cursor, limit ? Number(limit) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Nurse records fetched",
        data: nurse,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: limit ? Number(limit) : 50,
        },
    });
});
exports.getNurseRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const nurse = await (0, nurseService_1.getNurseById)(id);
    if (!nurse) {
        return next(new errorHandler_1.ErrorHandler("Nurse not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Nurse details fetched",
        data: nurse,
    });
});
exports.updateNurseRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.nurseSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // 🔍 Email uniqueness check
    if (validatedData.email) {
        const existingEmail = await (0, nurseService_1.getNurseByEmail)(validatedData.email);
        if (existingEmail && existingEmail.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another nurse with this email already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedNurse = await (0, nurseService_1.updateNurse)(id, validatedData);
    if (!updatedNurse) {
        return next(new errorHandler_1.ErrorHandler("Nurse not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Nurse updated successfully",
        data: updatedNurse,
    });
});
exports.deleteNurseRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedNurse = await (0, nurseService_1.deleteNurse)(id);
    if (!deletedNurse) {
        return next(new errorHandler_1.ErrorHandler("Nurse not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Nurse deleted successfully",
        data: deletedNurse,
    });
});
exports.searchNurseResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const nurses = await (0, nurseService_1.searchNurse)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: nurses,
    });
});
exports.filterNurses = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.nurseFilterSchema.parse(req.query);
    const { data, nextCursor } = await (0, nurseService_1.filterNursesService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered nurses fetched",
        data,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: validated.limit || 50,
        },
    });
});
