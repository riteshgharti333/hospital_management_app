"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runExpiredAppointmentsUpdate = exports.filterAppointments = exports.searchAppointmentResults = exports.deleteAppointmentRecord = exports.cancelAppointmentRecord = exports.updateAppointmentRecord = exports.getAppointmentRecordById = exports.getAllAppointmentRecords = exports.createAppointmentRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const appointmentService_1 = require("../services/appointmentService");
const paginationConfig_1 = require("../lib/paginationConfig");
const schemas_1 = require("@hospital/schemas");
const prisma_1 = require("../lib/prisma");
const doctorService_1 = require("../services/doctorService");
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
    const { query } = req.query;
    const searchTerm = typeof query === "string" ? query : null;
    if (!searchTerm) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.OK,
            message: "No search query provided",
            data: [],
        });
    }
    // 1️⃣ Direct appointment search
    const appointmentsDirect = await (0, appointmentService_1.searchAppointments)(searchTerm);
    // 2️⃣ Collect doctorIds
    const doctorIds = [
        ...new Set(appointmentsDirect.map((a) => a.doctorId)),
    ];
    // 3️⃣ Fetch doctors (batch)
    const doctors = doctorIds.length
        ? await prisma_1.prisma.doctor.findMany({
            where: { id: { in: doctorIds } },
            select: {
                id: true,
                fullName: true,
            },
        })
        : [];
    const doctorMap = new Map(doctors.map((d) => [d.id, d]));
    // 4️⃣ Enrich direct results
    const enrichedDirect = appointmentsDirect.map((a) => ({
        ...a,
        doctor: doctorMap.get(a.doctorId) || null,
    }));
    // 5️⃣ Search doctors by name (THIS is key part)
    const matchedDoctors = await (0, doctorService_1.searchDoctor)(searchTerm);
    const matchedDoctorIds = matchedDoctors.map((d) => d.id);
    // 6️⃣ Appointments via doctor name
    const appointmentsViaDoctors = matchedDoctorIds.length
        ? await prisma_1.prisma.appointment.findMany({
            where: {
                doctorId: { in: matchedDoctorIds },
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })
        : [];
    // 7️⃣ Merge + dedupe
    const mergedMap = new Map();
    enrichedDirect.forEach((a) => mergedMap.set(a.id, a));
    appointmentsViaDoctors.forEach((a) => mergedMap.set(a.id, a));
    const mergedResults = Array.from(mergedMap.values());
    // 8️⃣ Response
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: mergedResults,
    });
});
exports.filterAppointments = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.appointmentFilterSchema.parse(req.query);
    const { data, nextCursor, hasMore } = await (0, appointmentService_1.filterAppointmentsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered appointments fetched",
        data,
        pagination: {
            nextCursor: nextCursor || undefined,
            limit: validated.limit ?? paginationConfig_1.PAGINATION_CONFIG.DEFAULT_LIMIT,
            hasMore,
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
