"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPatientsService = exports.searchPatient = exports.deletePatient = exports.updatePatient = exports.getPatientById = exports.getAllPatients = exports.createPatient = void 0;
const prisma_1 = require("../lib/prisma");
const cacheVersion_1 = require("../utils/cacheVersion");
const filterPaginate_1 = require("../utils/filterPaginate");
const generateHospitalId_1 = require("../utils/generateHospitalId");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const createPatient = async (data) => {
    const hospitalPatientId = await (0, generateHospitalId_1.generateHospitalId)({
        prefix: "PAT",
        model: "patient",
        field: "hospitalPatientId",
    });
    const patient = await prisma_1.prisma.patient.create({
        data: {
            ...data,
            hospitalPatientId,
        },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("patient");
    return patient;
};
exports.createPatient = createPatient;
const getAllPatients = async (cursor) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, { model: "patient" }, cursor);
};
exports.getAllPatients = getAllPatients;
const getPatientById = async (id) => {
    return prisma_1.prisma.patient.findUnique({
        where: { id },
    });
};
exports.getPatientById = getPatientById;
const updatePatient = async (id, data) => {
    const patient = await prisma_1.prisma.patient.update({
        where: { id },
        data,
    });
    await (0, cacheVersion_1.bumpCacheVersion)("patient");
    return patient;
};
exports.updatePatient = updatePatient;
const deletePatient = async (id) => {
    const patient = await prisma_1.prisma.patient.delete({ where: { id } });
    await (0, cacheVersion_1.bumpCacheVersion)("patient");
    return patient;
};
exports.deletePatient = deletePatient;
const commonSearchFields = [
    "fullName",
    "mobileNumber",
    "aadhaarNumber",
    "hospitalPatientId",
];
exports.searchPatient = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Patient",
    exactFields: ["fullName", "mobileNumber", "aadhaarNumber", "hospitalPatientId"],
    prefixFields: ["fullName"],
    similarFields: ["fullName", "address"],
    selectFields: [
        "id",
        "hospitalPatientId",
        "fullName",
        // "dateOfBirth",
        "gender",
        "mobileNumber",
        "aadhaarNumber",
        "createdAt",
    ],
});
const filterPatientsService = async (params) => {
    const { fromDate, toDate, gender, cursor, limit } = params;
    const where = {};
    if (gender) {
        where.gender = {
            equals: gender,
            mode: "insensitive",
        };
    }
    if (fromDate || toDate) {
        where.createdAt = {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "patient",
        limit,
    }, cursor, where);
};
exports.filterPatientsService = filterPatientsService;
