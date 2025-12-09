"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBirthsService = exports.searchBirth = exports.deleteBirth = exports.updateBirth = exports.getBirthById = exports.getAllBirthService = exports.createBirth = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const filterPaginate_1 = require("../utils/filterPaginate");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const createBirth = async (data) => {
    return prisma_1.prisma.birth.create({ data });
};
exports.createBirth = createBirth;
const getAllBirthService = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "birth",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllBirthService = getAllBirthService;
const getBirthById = async (id) => {
    return prisma_1.prisma.birth.findUnique({ where: { id } });
};
exports.getBirthById = getBirthById;
const updateBirth = async (id, data) => {
    return prisma_1.prisma.birth.update({
        where: { id },
        data,
    });
};
exports.updateBirth = updateBirth;
const deleteBirth = async (id) => {
    return prisma_1.prisma.birth.delete({ where: { id } });
};
exports.deleteBirth = deleteBirth;
const commonSearchFields = ["fathersName", "mothersName", "mobileNumber"];
exports.searchBirth = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Birth",
    cacheKeyPrefix: "birth",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
const filterBirthsService = async (filters) => {
    const { fromDate, toDate, babySex, deliveryType, cursor, limit } = filters;
    // Build filter object
    const filterObj = {};
    if (babySex)
        filterObj.babySex = { equals: babySex, mode: "insensitive" };
    if (deliveryType)
        filterObj.deliveryType = { equals: deliveryType, mode: "insensitive" };
    if (fromDate || toDate)
        filterObj.birthDate = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    // Call filterPaginate
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "birth",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterBirthsService = filterBirthsService;
