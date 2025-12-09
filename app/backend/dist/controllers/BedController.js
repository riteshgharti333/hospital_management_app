"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBedResults = exports.deleteBedRecord = exports.updateBedRecord = exports.getBedRecordById = exports.getAllBedRecords = exports.createBedRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const bedService_1 = require("../services/bedService");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../utils/queryValidation");
exports.createBedRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.bedSchema.parse(req.body);
    const existingBed = await (0, bedService_1.getBedByNumber)(validated.bedNumber);
    if (existingBed) {
        return next(new errorHandler_1.ErrorHandler("Bed with this number already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const bed = await (0, bedService_1.createBed)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Bed created successfully",
        data: bed,
    });
});
exports.getAllBedRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor, limit } = req.query;
    const { data: bed, nextCursor } = await (0, bedService_1.getAllBeds)(cursor, limit ? Number(limit) : undefined);
    console.log("Bed data:", bed);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bed records fetched",
        data: bed,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: limit ? Number(limit) : 50,
        },
    });
});
exports.getBedRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const bed = await (0, bedService_1.getBedById)(id);
    if (!bed) {
        return next(new errorHandler_1.ErrorHandler("Bed not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bed details fetched",
        data: bed,
    });
});
exports.updateBedRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.bedSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // Check if updating bed number to an existing one
    if (validatedData.bedNumber) {
        const existingBed = await (0, bedService_1.getBedByNumber)(validatedData.bedNumber);
        if (existingBed && existingBed.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another bed with this number already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedBed = await (0, bedService_1.updateBed)(id, validatedData);
    if (!updatedBed) {
        return next(new errorHandler_1.ErrorHandler("Bed not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bed updated successfully",
        data: updatedBed,
    });
});
exports.deleteBedRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedBed = await (0, bedService_1.deleteBed)(id);
    if (!deletedBed) {
        return next(new errorHandler_1.ErrorHandler("Bed not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bed deleted successfully",
        data: deletedBed,
    });
});
exports.searchBedResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const beds = await (0, bedService_1.searchBed)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: beds,
    });
});
