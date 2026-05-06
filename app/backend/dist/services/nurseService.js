"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterNursesService = exports.searchNurse = exports.deleteNurse = exports.updateNurse = exports.getNurseById = exports.getAllNursesService = exports.getNurseByEmail = exports.createNurse = void 0;
const prisma_1 = require("../lib/prisma");
const cacheVersion_1 = require("../utils/cacheVersion");
const filterPaginate_1 = require("../utils/filterPaginate");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const registrationGenerator_1 = require("../utils/registrationGenerator");
const createNurse = async (data) => {
    const registrationNo = await (0, registrationGenerator_1.generateRegistrationNumber)(prisma_1.prisma.nurse, "NUR", "registrationNo");
    const nurse = await prisma_1.prisma.nurse.create({
        data: {
            ...data,
            registrationNo,
        },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("nurse");
    return nurse;
};
exports.createNurse = createNurse;
const getNurseByEmail = async (email) => {
    return prisma_1.prisma.nurse.findUnique({ where: { email } });
};
exports.getNurseByEmail = getNurseByEmail;
const getAllNursesService = async (cursor) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, { model: "nurse" }, cursor);
};
exports.getAllNursesService = getAllNursesService;
const getNurseById = async (id) => {
    return prisma_1.prisma.nurse.findUnique({ where: { id } });
};
exports.getNurseById = getNurseById;
const updateNurse = async (id, data) => {
    const nurse = await prisma_1.prisma.$transaction(async (tx) => {
        const updatedNurse = await tx.nurse.update({
            where: { id },
            data,
        });
        const userUpdateData = {};
        if (data.fullName)
            userUpdateData.name = data.fullName;
        if (data.email)
            userUpdateData.email = data.email;
        if (Object.keys(userUpdateData).length > 0) {
            await tx.user.update({
                where: { regId: updatedNurse.registrationNo },
                data: userUpdateData,
            });
        }
        return updatedNurse;
    });
    await (0, cacheVersion_1.bumpCacheVersion)("nurse");
    return nurse;
};
exports.updateNurse = updateNurse;
const deleteNurse = async (id) => {
    const nurse = await prisma_1.prisma.$transaction(async (tx) => {
        const nurseData = await tx.nurse.findUnique({
            where: { id },
            select: { registrationNo: true },
        });
        if (!nurseData)
            return null;
        const deletedNurse = await tx.nurse.delete({ where: { id } });
        await tx.user.deleteMany({ where: { regId: nurseData.registrationNo } });
        return deletedNurse;
    });
    await (0, cacheVersion_1.bumpCacheVersion)("nurse");
    return nurse;
};
exports.deleteNurse = deleteNurse;
exports.searchNurse = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Nurse",
    exactFields: ["fullName", "mobileNumber", "registrationNo"],
    prefixFields: ["fullName"],
    similarFields: ["fullName"],
    selectFields: [
        "id",
        "registrationNo",
        "fullName",
        "mobileNumber",
        "department",
        "address",
        "shift",
        "email",
        "status",
        "createdAt",
    ],
});
const filterNursesService = async (params) => {
    const { fromDate, toDate, shift, status, cursor } = params;
    const where = {};
    if (shift) {
        where.shift = {
            equals: shift,
            mode: "insensitive",
        };
    }
    if (status) {
        where.status = {
            equals: status,
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
        model: "nurse",
    }, cursor, where);
};
exports.filterNursesService = filterNursesService;
