"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDoctorsService = exports.searchDoctor = exports.deleteDoctor = exports.updateDoctor = exports.getDoctorsByDepartment = exports.getDoctorByRegistration = exports.getDoctorById = exports.getAllDoctors = exports.getDoctorByEmail = exports.createDoctor = void 0;
const prisma_1 = require("../lib/prisma");
const pagination_1 = require("../utils/pagination");
const filterPaginate_1 = require("../utils/filterPaginate");
const searchCache_1 = require("../utils/searchCache");
const registrationGenerator_1 = require("../utils/registrationGenerator");
const cacheVersion_1 = require("../utils/cacheVersion");
const createDoctor = async (data) => {
    const registrationNo = await (0, registrationGenerator_1.generateRegistrationNumber)(prisma_1.prisma.doctor, "DOC", "registrationNo");
    const result = await prisma_1.prisma.doctor.create({
        data: {
            ...data,
            registrationNo,
        },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("doctor");
    return result;
};
exports.createDoctor = createDoctor;
const getDoctorByEmail = async (email) => {
    return prisma_1.prisma.doctor.findUnique({ where: { email } });
};
exports.getDoctorByEmail = getDoctorByEmail;
const getAllDoctors = async (cursor) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, { model: "doctor" }, cursor);
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
    return prisma_1.prisma.$transaction(async (tx) => {
        // 1️⃣ Update doctor
        const updatedDoctor = await tx.doctor.update({
            where: { id },
            data,
        });
        // 2️⃣ Prepare user update data
        const userUpdateData = {};
        if (data.fullName) {
            userUpdateData.name = data.fullName;
        }
        if (data.email) {
            userUpdateData.email = data.email;
        }
        // 3️⃣ Safe user update
        if (Object.keys(userUpdateData).length > 0) {
            await tx.user.updateMany({
                where: { regId: updatedDoctor.registrationNo },
                data: userUpdateData,
            });
        }
        await (0, cacheVersion_1.bumpCacheVersion)("doctor");
        return updatedDoctor;
    });
};
exports.updateDoctor = updateDoctor;
const deleteDoctor = async (id) => {
    const deletedDoctor = await prisma_1.prisma.$transaction(async (tx) => {
        const doctor = await tx.doctor.findUnique({
            where: { id },
            select: { registrationNo: true },
        });
        if (!doctor)
            return null;
        const deleted = await tx.doctor.delete({
            where: { id },
        });
        await tx.user.deleteMany({
            where: { regId: doctor.registrationNo },
        });
        return deleted;
    });
    // ✅ Fire-and-forget (non-blocking)
    (0, cacheVersion_1.bumpCacheVersion)("doctor");
    return deletedDoctor;
};
exports.deleteDoctor = deleteDoctor;
exports.searchDoctor = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Doctor",
    exactFields: ["fullName", "mobileNumber", "registrationNo"],
    prefixFields: ["fullName"],
    similarFields: ["fullName"],
    selectFields: [
        "id",
        "fullName",
        "mobileNumber",
        "registrationNo",
        "qualification",
        "specialization",
        "status",
        "createdAt",
        "email",
    ],
});
const filterDoctorsService = async (params) => {
    const { fromDate, toDate, status, cursor, limit } = params;
    const where = {};
    // ✅ Status filter
    if (status) {
        where.status = {
            equals: status,
            mode: "insensitive",
        };
    }
    // ✅ Date range filter
    if (fromDate || toDate) {
        where.createdAt = {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "doctor",
        limit,
        // 🔥 Optional optimization
        // select: {
        //   id: true,
        //   fullName: true,
        //   status: true,
        //   createdAt: true,
        // },
    }, cursor, where);
};
exports.filterDoctorsService = filterDoctorsService;
