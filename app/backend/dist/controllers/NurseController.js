"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNurseRecord = exports.updateNurseRecord = exports.getNurseRecordById = exports.getAllNurseRecords = exports.createNurseRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const nurseService_1 = require("../services/nurseService");
const schemas_1 = require("@hospital/schemas");
exports.createNurseRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.nurseSchema.parse(req.body);
    // Check if registration number already exists
    const existingNurse = await (0, nurseService_1.getNurseByRegistration)(validated.registrationNo);
    if (existingNurse) {
        return next(new errorHandler_1.ErrorHandler("Nurse with this registration number already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const nurse = await (0, nurseService_1.createNurse)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Nurse created successfully",
        data: nurse,
    });
});
exports.getAllNurseRecords = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const nurses = await (0, nurseService_1.getAllNurses)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "All nurses fetched successfully",
        data: nurses,
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
    // Check if updating registration number to an existing one
    if (validatedData.registrationNo) {
        const existingNurse = await (0, nurseService_1.getNurseByRegistration)(validatedData.registrationNo);
        if (existingNurse && existingNurse.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another nurse with this registration number already exists", statusCodes_1.StatusCodes.CONFLICT));
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
