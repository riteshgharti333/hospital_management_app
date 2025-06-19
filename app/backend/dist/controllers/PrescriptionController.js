"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrescriptionRecord = exports.updatePrescriptionRecord = exports.getPrescriptionRecordById = exports.getAllPrescriptionRecords = exports.createPrescriptionRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const prescriptionService_1 = require("../services/prescriptionService");
const schemas_1 = require("@hospital/schemas");
const createPrescriptionRecord = async (req, res, next) => {
    try {
        // ✅ Validate and parse
        const validated = schemas_1.prescriptionSchema.parse({
            ...req.body,
            prescriptionDate: new Date(req.body.prescriptionDate),
        });
        // ✅ Create in DB
        const prescription = await (0, prescriptionService_1.createPrescription)(validated);
        // ✅ Success response
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.CREATED,
            message: "Prescription created successfully",
            data: prescription,
        });
    }
    catch (error) {
        // ❌ If validation or DB fails, send error
        console.log(error);
        next(error); // Forward error to Express error handler middleware
    }
};
exports.createPrescriptionRecord = createPrescriptionRecord;
exports.getAllPrescriptionRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const patientId = req.query.patientId ? Number(req.query.patientId) : undefined;
    const prescriptions = patientId
        ? await (0, prescriptionService_1.getPrescriptionsByPatient)(patientId)
        : await (0, prescriptionService_1.getAllPrescriptions)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: patientId
            ? `Prescriptions for patient ${patientId} fetched`
            : "All prescriptions fetched",
        data: prescriptions,
    });
});
exports.getPrescriptionRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const prescription = await (0, prescriptionService_1.getPrescriptionById)(id);
    if (!prescription) {
        return next(new errorHandler_1.ErrorHandler("Prescription not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription details fetched",
        data: prescription,
    });
});
exports.updatePrescriptionRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.prescriptionSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        prescriptionDate: req.body.prescriptionDate ? new Date(req.body.prescriptionDate) : undefined
    });
    const updatedPrescription = await (0, prescriptionService_1.updatePrescription)(id, validatedData);
    if (!updatedPrescription) {
        return next(new errorHandler_1.ErrorHandler("Prescription not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription updated successfully",
        data: updatedPrescription,
    });
});
exports.deletePrescriptionRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedPrescription = await (0, prescriptionService_1.deletePrescription)(id);
    if (!deletedPrescription) {
        return next(new errorHandler_1.ErrorHandler("Prescription not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription deleted successfully",
        data: deletedPrescription,
    });
});
