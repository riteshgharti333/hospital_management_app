"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAdmissions = exports.searchAdmissionsResults = exports.deleteAdmission = exports.updateAdmission = exports.getAdmissionById = exports.getAllAdmissions = exports.createAdmission = void 0;
const client_1 = require("@prisma/client");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const admissionService_1 = require("../services/admissionService");
const patientService_1 = require("../services/patientService");
const prisma = new client_1.PrismaClient();
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../utils/queryValidation");
const patientService_2 = require("../services/patientService");
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
    const { cursor, limit } = req.query;
    const { data: admission, nextCursor } = await (0, admissionService_1.getAllAdmissionsService)(cursor, limit ? Number(limit) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission records fetched",
        data: admission,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: limit ? Number(limit) : 50,
        },
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
//////////// SEARCH ADMISSIONS
exports.searchAdmissionsResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    // 1️⃣ Direct admission search (admissionId etc.)
    const admissionsDirect = await (0, admissionService_1.searchAdmissions)(searchTerm);
    // 2️⃣ Patient search
    const patients = await (0, patientService_2.searchPatient)(searchTerm);
    const patientIds = patients.map((p) => p.id);
    // 3️⃣ Admissions via patients
    const admissionsViaPatients = patientIds.length
        ? await prisma.admission.findMany({
            where: {
                patientId: { in: patientIds },
            },
            include: {
                patient: {
                    select: {
                        hospitalPatientId: true,
                        fullName: true,
                        gender: true,
                        mobileNumber: true,
                        aadhaarNumber: true,
                    },
                },
                doctor: {
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })
        : [];
    // 4️⃣ Merge + deduplicate by admission.id
    const mergedMap = new Map();
    admissionsDirect.forEach((a) => mergedMap.set(a.id, a));
    admissionsViaPatients.forEach((a) => mergedMap.set(a.id, a));
    const mergedResults = Array.from(mergedMap.values());
    // 5️⃣ Send response
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Admission search results fetched successfully",
        data: mergedResults,
    });
});
///////////
exports.filterAdmissions = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.admissionFilterSchema.parse(req.query);
    const { fromDate, toDate, gender, cursor, limit, } = validated;
    let admissions = [];
    // 🟢 CASE 1: gender filter exists
    if (gender) {
        // 1️⃣ Filter patients by gender
        const { data: patients } = await (0, patientService_1.filterPatientsService)({ gender });
        const patientIds = patients.map((p) => p.id);
        if (patientIds.length === 0) {
            return (0, sendResponse_1.sendResponse)(res, {
                success: true,
                statusCode: statusCodes_1.StatusCodes.OK,
                message: "Filtered admissions fetched",
                data: [],
                pagination: { limit: limit || 50 },
            });
        }
        // 2️⃣ Fetch admissions by patientIds + optional date
        admissions = await prisma.admission.findMany({
            where: {
                patientId: { in: patientIds },
                ...(fromDate || toDate
                    ? {
                        admissionDate: {
                            gte: fromDate,
                            lte: toDate,
                        },
                    }
                    : {}),
            },
            include: {
                patient: {
                    select: {
                        hospitalPatientId: true,
                        fullName: true,
                        gender: true,
                        mobileNumber: true,
                        aadhaarNumber: true
                    },
                },
                doctor: {
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: limit || 50,
        });
    }
    // 🟢 CASE 2: NO gender filter → admission-only filter
    else {
        const { data } = await (0, admissionService_1.filterAdmissionsService)({
            fromDate,
            toDate,
            cursor,
            limit,
        });
        admissions = data;
    }
    // 3️⃣ Send response
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered admissions fetched",
        data: admissions,
        pagination: {
            limit: limit || 50,
        },
    });
});
