"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctorRecord = exports.updateDoctorRecord = exports.getDoctorRecordById = exports.getAllDoctorRecords = exports.createDoctorRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const doctorService_1 = require("../services/doctorService");
const schemas_1 = require("@hospital/schemas");
exports.createDoctorRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.doctorSchema.parse(req.body);
    // Check if registration number already exists
    const existingDoctor = await (0, doctorService_1.getDoctorByRegistration)(validated.registrationNo);
    if (existingDoctor) {
        return next(new errorHandler_1.ErrorHandler("Doctor with this registration number already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const doctor = await (0, doctorService_1.createDoctor)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Doctor created successfully",
        data: doctor,
    });
});
exports.getAllDoctorRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const department = req.query.department;
    const doctors = department
        ? await (0, doctorService_1.getDoctorsByDepartment)(department)
        : await (0, doctorService_1.getAllDoctors)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: department
            ? `Doctors in ${department} department fetched`
            : "All doctors fetched",
        data: doctors,
    });
});
exports.getDoctorRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const doctor = await (0, doctorService_1.getDoctorById)(id);
    if (!doctor) {
        return next(new errorHandler_1.ErrorHandler("Doctor not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor details fetched",
        data: doctor,
    });
});
exports.updateDoctorRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.doctorSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // Check if updating registration number to an existing one
    if (validatedData.registrationNo) {
        const existingDoctor = await (0, doctorService_1.getDoctorByRegistration)(validatedData.registrationNo);
        if (existingDoctor && existingDoctor.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another doctor with this registration number already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedDoctor = await (0, doctorService_1.updateDoctor)(id, validatedData);
    if (!updatedDoctor) {
        return next(new errorHandler_1.ErrorHandler("Doctor not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Doctor updated successfully",
        data: updatedDoctor,
    });
});
const library_1 = require("@prisma/client/runtime/library");
exports.deleteDoctorRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    try {
        const deletedDoctor = await (0, doctorService_1.deleteDoctor)(id);
        if (!deletedDoctor) {
            return next(new errorHandler_1.ErrorHandler("Doctor not found", statusCodes_1.StatusCodes.NOT_FOUND));
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.OK,
            message: "Doctor deleted successfully",
            data: deletedDoctor,
        });
    }
    catch (error) {
        // Handle foreign key constraint violation
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === "P2003") {
            return next(new errorHandler_1.ErrorHandler("Cannot delete doctor: Prescriptions linked to this doctor exist.", statusCodes_1.StatusCodes.CONFLICT));
        }
        // Generic error fallback
        return next(new errorHandler_1.ErrorHandler("An error occurred while deleting doctor", statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
