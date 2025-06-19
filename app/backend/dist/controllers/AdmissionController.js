"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmission = exports.updateAdmission = exports.getAdmissionById = exports.getAllAdmissions = exports.createAdmission = void 0;
const client_1 = require("@prisma/client");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const prisma = new client_1.PrismaClient();
const schemas_1 = require("@hospital/schemas");
// CREATE
exports.createAdmission = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.admissionSchema.parse(req.body);
    const admission = await prisma.admission.create({ data: validated });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Admission created successfully",
        data: admission,
    });
});
// GET ALL
exports.getAllAdmissions = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const admissions = await prisma.admission.findMany({
        orderBy: { createdAt: 'desc' }
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "All admissions fetched",
        data: admissions,
    });
});
// GET SINGLE BY ID
exports.getAdmissionById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const admission = await prisma.admission.findUnique({ where: { id } });
    if (!admission)
        return next(new errorHandler_1.ErrorHandler("Admission not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission details fetched",
        data: admission,
    });
});
// UPDATE
exports.updateAdmission = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    // Allow partial update
    const partialSchema = schemas_1.admissionSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedAdmission = await prisma.admission.update({
        where: { id },
        data: validatedData,
    });
    if (!updatedAdmission)
        return next(new errorHandler_1.ErrorHandler("Admission not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission updated successfully",
        data: updatedAdmission,
    });
});
// DELETE
exports.deleteAdmission = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const deletedAdmission = await prisma.admission.delete({ where: { id } });
    if (!deletedAdmission)
        return next(new errorHandler_1.ErrorHandler("Admission not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission deleted successfully",
        data: deletedAdmission,
    });
});
