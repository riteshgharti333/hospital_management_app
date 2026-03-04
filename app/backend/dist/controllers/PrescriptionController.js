"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPrescriptions = exports.searchPrescriptionsResults = exports.getAllPrescriptionRecords = exports.createPrescriptionRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const prescriptionService_1 = require("../services/prescriptionService");
const schemas_1 = require("@hospital/schemas");
const cloudinaryUploader_1 = require("../utils/cloudinaryUploader");
const queryValidation_1 = require("../utils/queryValidation");
const prescriptionSearchCache_1 = require("../utils/prescriptionSearchCache");
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
    const { cursor, limit } = req.query;
    const { data: prescription, nextCursor } = await (0, prescriptionService_1.getAllPrescriptions)(cursor, limit ? Number(limit) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Prescription records fetched",
        data: prescription,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: limit ? Number(limit) : 50,
        },
    });
});
// export const getPrescriptionRecordById = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const id = Number(req.params.id);
//     if (isNaN(id)) {
//       return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
//     }
//     const prescription = await getPrescriptionById(id);
//     if (!prescription) {
//       return next(
//         new ErrorHandler("Prescription not found", StatusCodes.NOT_FOUND)
//       );
//     }
//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: "Prescription details fetched",
//       data: prescription,
//     });
//   }
// );
// export const updatePrescriptionRecord = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const id = Number(req.params.id);
//     if (isNaN(id)) {
//       return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
//     }
//     const existing = await getPrescriptionById(id);
//     if (!existing) {
//       return next(
//         new ErrorHandler("Prescription not found", StatusCodes.NOT_FOUND)
//       );
//     }
//     let uploadedUrl: string | undefined;
//     // ✅ Delete old file and upload new if file exists
//     if (req.file) {
//       if (existing.prescriptionDoc) {
//         await deleteFromCloudinary(existing.prescriptionDoc);
//       }
//       uploadedUrl = await uploadToCloudinary(req.file.buffer);
//     }
//     const partialSchema = prescriptionSchema.partial();
//     const validatedData = partialSchema.parse({
//       ...req.body,
//       prescriptionDate: req.body.prescriptionDate
//         ? new Date(req.body.prescriptionDate)
//         : undefined,
//       doctorId: req.body.doctorId ? Number(req.body.doctorId) : undefined,
//       patientId: req.body.patientId ? Number(req.body.patientId) : undefined,
//       prescriptionDoc: uploadedUrl ?? req.body.prescriptionDoc ?? undefined,
//     });
//     const updatedPrescription = await updatePrescription(id, validatedData);
//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: "Prescription updated successfully",
//       data: updatedPrescription,
//     });
//   }
// );
// export const deletePrescriptionRecord = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const id = Number(req.params.id);
//     if (isNaN(id)) {
//       return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
//     }
//     const existing = await getPrescriptionById(id);
//     if (!existing) {
//       return next(
//         new ErrorHandler("Prescription not found", StatusCodes.NOT_FOUND)
//       );
//     }
//     if (existing.prescriptionDoc) {
//       await deleteFromCloudinary(existing.prescriptionDoc);
//     }
//     const deletedPrescription = await deletePrescription(id);
//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: "Prescription deleted successfully",
//     });
//   }
// );
exports.searchPrescriptionsResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const prescriptions = await (0, prescriptionSearchCache_1.searchPrescriptions)(searchTerm);
    res.status(200).json({
        success: true,
        message: "Prescriptions fetched successfully",
        data: prescriptions,
    });
});
exports.filterPrescriptions = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.prescriptionFilterSchema.parse(req.query);
    const { data, nextCursor } = await (0, prescriptionService_1.filterPrescriptionsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered prescriptions fetched",
        data,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: validated.limit || 50,
        },
    });
});
