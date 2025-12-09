"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBirths = exports.searchBirthResults = exports.deleteBirthRecord = exports.updateBirthRecord = exports.getBirthRecordById = exports.getAllBirth = exports.createBirthRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const birthService_1 = require("../services/birthService");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../utils/queryValidation");
exports.createBirthRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const validated = schemas_1.birthSchema.parse(req.body);
        const birth = await (0, birthService_1.createBirth)(validated);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.CREATED,
            message: "Birth record created successfully",
            data: birth,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllBirth = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor, limit } = req.query;
    const { data: birth, nextCursor } = await (0, birthService_1.getAllBirthService)(cursor, limit ? Number(limit) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Birth records fetched",
        data: birth,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: limit ? Number(limit) : 50,
        },
    });
});
exports.getBirthRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const birth = await (0, birthService_1.getBirthById)(id);
    if (!birth)
        return next(new errorHandler_1.ErrorHandler("Birth record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Birth record details fetched",
        data: birth,
    });
});
exports.updateBirthRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const partialSchema = schemas_1.birthSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedBirth = await (0, birthService_1.updateBirth)(id, validatedData);
    if (!updatedBirth)
        return next(new errorHandler_1.ErrorHandler("Birth record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Birth record updated successfully",
        data: updatedBirth,
    });
});
exports.deleteBirthRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const deletedBirth = await (0, birthService_1.deleteBirth)(id);
    if (!deletedBirth)
        return next(new errorHandler_1.ErrorHandler("Birth record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Birth record deleted successfully",
        data: deletedBirth,
    });
});
exports.searchBirthResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const birth = await (0, birthService_1.searchBirth)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: birth,
    });
});
exports.filterBirths = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    // Validate query params
    const validated = schemas_1.birthFilterSchema.parse(req.query);
    // Get filtered results
    const { data, nextCursor } = await (0, birthService_1.filterBirthsService)(validated);
    // Send response
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered births fetched",
        data,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: validated.limit || 50,
        },
    });
});
