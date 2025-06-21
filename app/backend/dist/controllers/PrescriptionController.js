"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrescriptionRecord = exports.updatePrescriptionRecord = exports.getPrescriptionRecordById = exports.getAllPrescriptionRecords = exports.createPrescriptionRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const prescriptionService_1 = require("../services/prescriptionService");
const schemas_1 = require("@hospital/schemas");
const cloudinaryUploader_1 = require("../utils/cloudinaryUploader");
const createPrescriptionRecord = async (req, res, next) => {
    try {
        let uploadedUrl;
        // ✅ Upload file if exists
        if (req.file) {
            uploadedUrl = await (0, cloudinaryUploader_1.uploadToCloudinary)(req.file.buffer);
        }
        const validated = schemas_1.prescriptionSchema.parse({
            ...req.body,
            prescriptionDate: new Date(req.body.prescriptionDate),
            doctorId: Number(req.body.doctorId),
            patientId: Number(req.body.patientId),
            prescriptionDoc: uploadedUrl,
        });
        const prescription = await (0, prescriptionService_1.createPrescription)(validated);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.CREATED,
            message: "Prescription created successfully",
            data: prescription,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createPrescriptionRecord = createPrescriptionRecord;
exports.getAllPrescriptionRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const patientId = req.query.patientId
        ? Number(req.query.patientId)
        : undefined;
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
    const existing = await (0, prescriptionService_1.getPrescriptionById)(id);
    if (!existing) {
        return next(new errorHandler_1.ErrorHandler("Prescription not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    let uploadedUrl;
    // ✅ Delete old file and upload new if file exists
    if (req.file) {
        if (existing.prescriptionDoc) {
            await (0, cloudinaryUploader_1.deleteFromCloudinary)(existing.prescriptionDoc);
        }
        uploadedUrl = await (0, cloudinaryUploader_1.uploadToCloudinary)(req.file.buffer);
    }
    const partialSchema = schemas_1.prescriptionSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        prescriptionDate: req.body.prescriptionDate
            ? new Date(req.body.prescriptionDate)
            : undefined,
        doctorId: req.body.doctorId ? Number(req.body.doctorId) : undefined,
        patientId: req.body.patientId ? Number(req.body.patientId) : undefined,
        prescriptionDoc: uploadedUrl ?? req.body.prescriptionDoc ?? undefined,
    });
    const updatedPrescription = await (0, prescriptionService_1.updatePrescription)(id, validatedData);
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
    const existing = await (0, prescriptionService_1.getPrescriptionById)(id);
    if (!existing) {
        return next(new errorHandler_1.ErrorHandler("Prescription not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    if (existing.prescriptionDoc) {
        await (0, cloudinaryUploader_1.deleteFromCloudinary)(existing.prescriptionDoc);
    }
    const deletedPrescription = await (0, prescriptionService_1.deletePrescription)(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription deleted successfully",
    });
});
