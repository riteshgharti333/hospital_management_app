"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runExpiredAppointmentsUpdate = exports.filterAppointments = exports.searchAppointmentResults = exports.deleteAppointmentRecord = exports.cancelAppointmentRecord = exports.updateAppointmentRecord = exports.getAppointmentRecordById = exports.getAllAppointmentRecords = exports.createAppointmentRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const appointmentService_1 = require("../services/appointmentService");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../utils/queryValidation");
exports.createAppointmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.appointmentSchema.parse(req.body);
    const appointment = await (0, appointmentService_1.createAppointment)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Appointment created successfully",
        data: appointment,
    });
});
exports.getAllAppointmentRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor } = req.query;
    const result = await (0, appointmentService_1.getAllAppointmentsService)(cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Appointment records fetched",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
exports.getAppointmentRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const appointment = await (0, appointmentService_1.getAppointmentById)(id);
    if (!appointment) {
        return next(new errorHandler_1.ErrorHandler("Appointment not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Appointment details fetched",
        data: appointment,
    });
});
exports.updateAppointmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.appointmentSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedAppointment = await (0, appointmentService_1.updateAppointment)(id, validatedData);
    if (!updatedAppointment) {
        return next(new errorHandler_1.ErrorHandler("Appointment not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Appointment updated successfully",
        data: updatedAppointment,
    });
});
exports.cancelAppointmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const cancelledAppointment = await (0, appointmentService_1.cancelAppointment)(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Appointment cancelled successfully",
        data: cancelledAppointment,
    });
});
exports.deleteAppointmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedAppointment = await (0, appointmentService_1.deleteAppointment)(id);
    if (!deletedAppointment) {
        return next(new errorHandler_1.ErrorHandler("Appointment not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Appointment deleted successfully",
        data: deletedAppointment,
    });
});
exports.searchAppointmentResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query, cursor } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const result = await (0, appointmentService_1.searchAppointments)(searchTerm, cursor);
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
exports.filterAppointments = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.appointmentFilterSchema.parse(req.query);
    const result = await (0, appointmentService_1.filterAppointmentsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered appointments fetched",
        data: result.data,
        pagination: {
            nextCursor: result.nextCursor || undefined,
            hasMore: result.hasMore,
        },
    });
});
// Admin endpoint to manually trigger expired appointment update
exports.runExpiredAppointmentsUpdate = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const result = await (0, appointmentService_1.updateExpiredAppointments)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Expired appointments updated",
        data: {
            updatedCount: result.count,
        },
    });
});
