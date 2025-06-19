"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAmbulanceRecord = exports.updateAmbulanceRecord = exports.getAmbulanceRecordById = exports.getAllAmbulanceRecords = exports.createAmbulanceRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const ambulanceService_1 = require("../services/ambulanceService");
const schemas_1 = require("@hospital/schemas");
exports.createAmbulanceRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.ambulanceSchema.parse(req.body);
    // Check if registration number already exists
    const existingAmbulance = await (0, ambulanceService_1.getAmbulanceByRegistration)(validated.registrationNo);
    if (existingAmbulance) {
        return next(new errorHandler_1.ErrorHandler("Ambulance with this registration number already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const ambulance = await (0, ambulanceService_1.createAmbulance)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Ambulance created successfully",
        data: ambulance,
    });
});
exports.getAllAmbulanceRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const status = req.query.status;
    const ambulances = await (0, ambulanceService_1.getAllAmbulances)(status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: status
            ? `Ambulances with status ${status} fetched`
            : "All ambulances fetched",
        data: ambulances,
    });
});
exports.getAmbulanceRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const ambulance = await (0, ambulanceService_1.getAmbulanceById)(id);
    if (!ambulance) {
        return next(new errorHandler_1.ErrorHandler("Ambulance not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ambulance details fetched",
        data: ambulance,
    });
});
exports.updateAmbulanceRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.ambulanceSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // Check if updating registration number to an existing one
    if (validatedData.registrationNo) {
        const existingAmbulance = await (0, ambulanceService_1.getAmbulanceByRegistration)(validatedData.registrationNo);
        if (existingAmbulance && existingAmbulance.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another ambulance with this registration number already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedAmbulance = await (0, ambulanceService_1.updateAmbulance)(id, validatedData);
    if (!updatedAmbulance) {
        return next(new errorHandler_1.ErrorHandler("Ambulance not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ambulance updated successfully",
        data: updatedAmbulance,
    });
});
exports.deleteAmbulanceRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedAmbulance = await (0, ambulanceService_1.deleteAmbulance)(id);
    if (!deletedAmbulance) {
        return next(new errorHandler_1.ErrorHandler("Ambulance not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Ambulance deleted successfully",
        data: deletedAmbulance,
    });
});
