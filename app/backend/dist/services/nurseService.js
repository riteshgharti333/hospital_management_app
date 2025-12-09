"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterNursesService = exports.searchNurse = exports.deleteNurse = exports.updateNurse = exports.getNurseByRegistration = exports.getNurseById = exports.getAllNurses = exports.getNurseByEmail = exports.createNurse = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const filterPaginate_1 = require("../utils/filterPaginate");
const registrationGenerator_1 = require("../utils/registrationGenerator");
const createNurse = async (data) => {
    const registrationNo = await (0, registrationGenerator_1.generateRegistrationNumber)(prisma_1.prisma.nurse, "NUR", "registrationNo");
    return prisma_1.prisma.nurse.create({
        data: {
            ...data,
            registrationNo,
        },
    });
};
exports.createNurse = createNurse;
const getNurseByEmail = async (email) => {
    return prisma_1.prisma.nurse.findUnique({ where: { email } });
};
exports.getNurseByEmail = getNurseByEmail;
const getAllNurses = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "nurse",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllNurses = getAllNurses;
const getNurseById = async (id) => {
    return prisma_1.prisma.nurse.findUnique({ where: { id } });
};
exports.getNurseById = getNurseById;
const getNurseByRegistration = async (registrationNo) => {
    return prisma_1.prisma.nurse.findUnique({ where: { registrationNo } });
};
exports.getNurseByRegistration = getNurseByRegistration;
const updateNurse = async (id, data) => {
    return prisma_1.prisma.nurse.update({
        where: { id },
        data,
    });
};
exports.updateNurse = updateNurse;
const deleteNurse = async (id) => {
    return prisma_1.prisma.nurse.delete({ where: { id } });
};
exports.deleteNurse = deleteNurse;
const commonSearchFields = ["fullName", "mobileNumber", "registrationNo"];
exports.searchNurse = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Nurse",
    cacheKeyPrefix: "nurse",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
const filterNursesService = async (filters) => {
    const { fromDate, toDate, shift, status, cursor, limit } = filters;
    const filterObj = {};
    if (shift)
        filterObj.shift = { equals: shift, mode: "insensitive" };
    if (status)
        filterObj.status = { equals: status, mode: "insensitive" };
    if (fromDate || toDate)
        filterObj.createdAt = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "nurse",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterNursesService = filterNursesService;
