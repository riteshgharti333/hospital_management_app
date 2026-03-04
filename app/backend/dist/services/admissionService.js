"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAdmissionsService = exports.searchAdmissions = exports.deleteAdmission = exports.updateAdmission = exports.getAdmissionById = exports.getAllAdmissionsService = exports.findActiveAdmissionByPatient = exports.createAdmissionService = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const filterPaginate_1 = require("../utils/filterPaginate");
const generateHospitalId_1 = require("../utils/generateHospitalId");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const createAdmissionService = async (data) => {
    const hospitalAdmissionId = await (0, generateHospitalId_1.generateHospitalId)({
        prefix: "ADM",
        model: "admission",
        field: "hospitalAdmissionId",
    });
    return prisma_1.prisma.admission.create({
        data: {
            ...data,
            hospitalAdmissionId,
            status: "ADMITTED",
        },
    });
};
exports.createAdmissionService = createAdmissionService;
const findActiveAdmissionByPatient = async (patientId) => {
    return prisma_1.prisma.admission.findFirst({
        where: {
            patientId,
            status: "ADMITTED",
        },
    });
};
exports.findActiveAdmissionByPatient = findActiveAdmissionByPatient;
const getAllAdmissionsService = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "admission",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
        select: {
            id: true,
            hospitalAdmissionId: true,
            admissionDate: true,
            dischargeDate: true,
            patient: {
                select: {
                    id: true,
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
                },
            },
        },
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllAdmissionsService = getAllAdmissionsService;
const getAdmissionById = async (id) => {
    return prisma_1.prisma.admission.findUnique({ where: { id } });
};
exports.getAdmissionById = getAdmissionById;
const updateAdmission = async (id, data) => {
    return prisma_1.prisma.admission.update({
        where: { id },
        data,
    });
};
exports.updateAdmission = updateAdmission;
const deleteAdmission = async (id) => {
    return prisma_1.prisma.admission.delete({ where: { id } });
};
exports.deleteAdmission = deleteAdmission;
const commonSearchFields = ["hospitalAdmissionId"];
exports.searchAdmissions = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Admission",
    cacheKeyPrefix: "admission",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
/// Filter
const filterAdmissionsService = async (filters) => {
    const { fromDate, toDate, gender, cursor, limit } = filters;
    // Build filter object
    const filterObj = {};
    if (gender)
        filterObj.gender = { equals: gender, mode: "insensitive" };
    if (fromDate || toDate)
        filterObj.admissionDate = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    // Call filterPaginate
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "admission",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterAdmissionsService = filterAdmissionsService;
