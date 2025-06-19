"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePharmacistRecord = exports.updatePharmacistRecord = exports.getPharmacistRecordById = exports.getAllPharmacistRecords = exports.createPharmacistRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const pharmacistService_1 = require("../services/pharmacistService");
const schemas_1 = require("@hospital/schemas");
// import {medicineSchema} from "@hospital/schemas"
exports.createPharmacistRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.pharmacistSchema.parse(req.body);
    // Check if registration number already exists
    const existingPharmacist = await (0, pharmacistService_1.getPharmacistByRegistration)(validated.registrationNo);
    if (existingPharmacist) {
        return next(new errorHandler_1.ErrorHandler("Pharmacist with this registration number already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const pharmacist = await (0, pharmacistService_1.createPharmacist)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Pharmacist created successfully",
        data: pharmacist,
    });
});
exports.getAllPharmacistRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const department = req.query.department;
    const pharmacists = department
        ? await (0, pharmacistService_1.getPharmacistsByDepartment)(department)
        : await (0, pharmacistService_1.getAllPharmacists)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: department
            ? `Pharmacists in ${department} department fetched`
            : "All pharmacists fetched",
        data: pharmacists,
    });
});
exports.getPharmacistRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const pharmacist = await (0, pharmacistService_1.getPharmacistById)(id);
    if (!pharmacist) {
        return next(new errorHandler_1.ErrorHandler("Pharmacist not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Pharmacist details fetched",
        data: pharmacist,
    });
});
exports.updatePharmacistRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.pharmacistSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // Check if updating registration number to an existing one
    if (validatedData.registrationNo) {
        const existingPharmacist = await (0, pharmacistService_1.getPharmacistByRegistration)(validatedData.registrationNo);
        if (existingPharmacist && existingPharmacist.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another pharmacist with this registration number already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedPharmacist = await (0, pharmacistService_1.updatePharmacist)(id, validatedData);
    if (!updatedPharmacist) {
        return next(new errorHandler_1.ErrorHandler("Pharmacist not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Pharmacist updated successfully",
        data: updatedPharmacist,
    });
});
exports.deletePharmacistRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedPharmacist = await (0, pharmacistService_1.deletePharmacist)(id);
    if (!deletedPharmacist) {
        return next(new errorHandler_1.ErrorHandler("Pharmacist not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Pharmacist deleted successfully",
        data: deletedPharmacist,
    });
});
