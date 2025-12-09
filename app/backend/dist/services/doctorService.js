"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDoctorsService = exports.searchDoctor = exports.deleteDoctor = exports.updateDoctor = exports.getDoctorsByDepartment = exports.getDoctorByRegistration = exports.getDoctorById = exports.getAllDoctors = exports.getDoctorByEmail = exports.createDoctor = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const pagination_1 = require("../utils/pagination");
const filterPaginate_1 = require("../utils/filterPaginate");
const searchCache_1 = require("../utils/searchCache");
const registrationGenerator_1 = require("../utils/registrationGenerator");
const createDoctor = async (data) => {
    // Auto-generate registration number
    const registrationNo = await (0, registrationGenerator_1.generateRegistrationNumber)(prisma_1.prisma.doctor, "DOC", "registrationNo");
    return prisma_1.prisma.doctor.create({
        data: {
            ...data,
            registrationNo,
        },
    });
};
exports.createDoctor = createDoctor;
const getDoctorByEmail = async (email) => {
    return prisma_1.prisma.doctor.findUnique({ where: { email } });
};
exports.getDoctorByEmail = getDoctorByEmail;
const getAllDoctors = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "doctor",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllDoctors = getAllDoctors;
const getDoctorById = async (id) => {
    return prisma_1.prisma.doctor.findUnique({ where: { id } });
};
exports.getDoctorById = getDoctorById;
const getDoctorByRegistration = async (registrationNo) => {
    return prisma_1.prisma.doctor.findUnique({ where: { registrationNo } });
};
exports.getDoctorByRegistration = getDoctorByRegistration;
const getDoctorsByDepartment = async (department) => {
    return prisma_1.prisma.doctor.findMany({
        where: { department },
        orderBy: { fullName: "asc" },
    });
};
exports.getDoctorsByDepartment = getDoctorsByDepartment;
const updateDoctor = async (id, data) => {
    return prisma_1.prisma.doctor.update({ where: { id }, data });
};
exports.updateDoctor = updateDoctor;
const deleteDoctor = async (id) => {
    return prisma_1.prisma.doctor.delete({ where: { id } });
};
exports.deleteDoctor = deleteDoctor;
const commonSearchFields = ["fullName", "mobileNumber", "registrationNo"];
exports.searchDoctor = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Doctor",
    cacheKeyPrefix: "doctor",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
const filterDoctorsService = async (filters) => {
    const { fromDate, toDate, status, cursor, limit } = filters;
    const filterObj = {};
    if (status)
        filterObj.status = { equals: status, mode: "insensitive" };
    if (fromDate || toDate)
        filterObj.createdAt = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "doctor",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterDoctorsService = filterDoctorsService;
