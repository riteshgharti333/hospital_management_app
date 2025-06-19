"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServiceChargeRecord = exports.updateServiceChargeRecord = exports.getServiceChargeRecordById = exports.getAllServiceChargeRecords = exports.createServiceChargeRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const serviceChargesService_1 = require("../../services/itemService/serviceChargesService");
const schemas_1 = require("@hospital/schemas");
exports.createServiceChargeRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.serviceChargeSchema.parse(req.body);
    const serviceCharge = await (0, serviceChargesService_1.createServiceCharge)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Service charge created successfully",
        data: serviceCharge,
    });
});
exports.getAllServiceChargeRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const category = req.query.category;
    const serviceCharges = category
        ? await (0, serviceChargesService_1.getServiceChargesByCategory)(category)
        : await (0, serviceChargesService_1.getAllServiceCharges)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: category
            ? `Service charges in ${category} category fetched`
            : "All service charges fetched",
        data: serviceCharges,
    });
});
exports.getServiceChargeRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const serviceCharge = await (0, serviceChargesService_1.getServiceChargeById)(id);
    if (!serviceCharge) {
        return next(new errorHandler_1.ErrorHandler("Service charge not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Service charge details fetched",
        data: serviceCharge,
    });
});
exports.updateServiceChargeRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.serviceChargeSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // Validate tax percentage if tax is applicable
    if (validatedData.taxApplicable && !validatedData.taxPercentage) {
        return next(new errorHandler_1.ErrorHandler("Tax percentage is required when tax is applicable", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const updatedServiceCharge = await (0, serviceChargesService_1.updateServiceCharge)(id, validatedData);
    if (!updatedServiceCharge) {
        return next(new errorHandler_1.ErrorHandler("Service charge not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Service charge updated successfully",
        data: updatedServiceCharge,
    });
});
exports.deleteServiceChargeRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedServiceCharge = await (0, serviceChargesService_1.deleteServiceCharge)(id);
    if (!deletedServiceCharge) {
        return next(new errorHandler_1.ErrorHandler("Service charge not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Service charge deleted successfully",
        data: deletedServiceCharge,
    });
});
