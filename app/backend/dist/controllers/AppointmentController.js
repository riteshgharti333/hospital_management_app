"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointmentRecord = exports.updateAppointmentRecord = exports.getAppointmentRecordById = exports.getAllAppointmentRecords = exports.createAppointmentRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const appointmentService_1 = require("../services/appointmentService");
const schemas_1 = require("@hospital/schemas");
exports.createAppointmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.appointmentSchema.parse({
        ...req.body,
        appointmentDate: new Date(req.body.appointmentDate)
    });
    const appointment = await (0, appointmentService_1.createAppointment)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Appointment created successfully",
        data: appointment,
    });
});
exports.getAllAppointmentRecords = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const appointments = await (0, appointmentService_1.getAllAppointments)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Appointments fetched successfully",
        data: appointments,
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
    const validatedData = partialSchema.parse({
        ...req.body,
        appointmentDate: req.body.appointmentDate ? new Date(req.body.appointmentDate) : undefined
    });
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
