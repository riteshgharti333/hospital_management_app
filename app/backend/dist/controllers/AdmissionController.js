"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAdmissions = exports.searchAdmissionsResults = exports.deleteAdmission = exports.updateAdmission = exports.getAdmissionById = exports.getAllAdmissions = exports.createAdmission = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const admissionService_1 = require("../services/admissionService");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../utils/queryValidation");
const patientService_1 = require("../services/patientService");
const prisma_1 = require("../lib/prisma");
const paginationConfig_1 = require("../lib/paginationConfig");
// CREATE
exports.createAdmission = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    // 1️⃣ Validate body
    const validated = schemas_1.admissionSchema.parse(req.body);
    // 2️⃣ Business rule (controller responsibility)
    const activeAdmission = await (0, admissionService_1.findActiveAdmissionByPatient)(validated.patientId);
    // if (activeAdmission) {
    //   return sendResponse(res, {
    //     success: false,
    //     statusCode: StatusCodes.BAD_REQUEST,
    //     message: "Patient already has an active admission",
    //   });
    // }
    // 3️⃣ Create admission (DB + ID handled in service)
    const admission = await (0, admissionService_1.createAdmissionService)(validated);
    // 4️⃣ Send response
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Admission created successfully",
        data: admission,
    });
});
// GET ALL
exports.getAllAdmissions = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor } = req.query;
    const result = await (0, admissionService_1.getAllAdmissionsService)(cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission records fetched",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
// GET SINGLE BY ID
exports.getAdmissionById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const admission = await prisma_1.prisma.admission.findUnique({ where: { id } });
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
    const updatedAdmission = await prisma_1.prisma.admission.update({
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
    const deletedAdmission = await prisma_1.prisma.admission.delete({ where: { id } });
    if (!deletedAdmission)
        return next(new errorHandler_1.ErrorHandler("Admission not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission deleted successfully",
        data: deletedAdmission,
    });
});
//////////// SEARCH ADMISSIONS
exports.searchAdmissionsResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    // 1️⃣ Direct admission search (admissionId etc.)
    const admissionsDirect = await (0, admissionService_1.searchAdmissions)(searchTerm);
    // Enrich direct admissions with patient and doctor data
    const enrichedDirectAdmissions = await Promise.all(admissionsDirect.map(async (admission) => {
        const [patient, doctor] = await Promise.all([
            prisma_1.prisma.patient.findUnique({
                where: { id: admission.patientId },
                select: {
                    id: true,
                    fullName: true,
                    gender: true,
                    mobileNumber: true,
                    aadhaarNumber: true,
                    hospitalPatientId: true,
                    address: true
                },
            }),
            prisma_1.prisma.doctor.findUnique({
                where: { id: admission.doctorId },
                select: {
                    id: true,
                    fullName: true,
                    specialization: true,
                    mobileNumber: true,
                },
            }),
        ]);
        return { ...admission, patient, doctor };
    }));
    // 2️⃣ Patient search
    const patients = await (0, patientService_1.searchPatient)(searchTerm);
    const patientIds = patients.map((p) => p.id);
    // 3️⃣ Admissions via patients (already has include)
    const admissionsViaPatients = patientIds.length
        ? await prisma_1.prisma.admission.findMany({
            where: {
                patientId: { in: patientIds },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        hospitalPatientId: true,
                        fullName: true,
                        gender: true,
                        mobileNumber: true,
                        aadhaarNumber: true,
                    },
                },
                doctor: {
                    select: {
                        id: true,
                        fullName: true,
                        specialization: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })
        : [];
    // 4️⃣ Merge + deduplicate by admission.id
    const mergedMap = new Map();
    enrichedDirectAdmissions.forEach((a) => mergedMap.set(a.id, a));
    admissionsViaPatients.forEach((a) => mergedMap.set(a.id, a));
    const mergedResults = Array.from(mergedMap.values());
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission search results fetched successfully",
        data: mergedResults,
    });
});
/////////// FILTER ADMISSIONS
exports.filterAdmissions = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.admissionFilterSchema.parse(req.query);
    const { data, nextCursor, hasMore } = await (0, admissionService_1.filterAdmissionsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered admissions fetched",
        data,
        pagination: {
            nextCursor: nextCursor || undefined,
            limit: validated.limit ?? paginationConfig_1.PAGINATION_CONFIG.DEFAULT_LIMIT,
            hasMore,
        },
    });
});
