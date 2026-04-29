"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBirthsService = exports.searchBirth = exports.deleteBirth = exports.updateBirth = exports.getBirthById = exports.getAllBirthService = exports.createBirth = void 0;
const prisma_1 = require("../lib/prisma");
const cacheVersion_1 = require("../utils/cacheVersion");
const filterPaginate_1 = require("../utils/filterPaginate");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const createBirth = async (data) => {
    const birth = await prisma_1.prisma.birth.create({ data });
    await (0, cacheVersion_1.bumpCacheVersion)("birth");
    return birth;
};
exports.createBirth = createBirth;
const getAllBirthService = async (cursor) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, { model: "birth" }, cursor);
};
exports.getAllBirthService = getAllBirthService;
const getBirthById = async (id) => {
    return prisma_1.prisma.birth.findUnique({ where: { id } });
};
exports.getBirthById = getBirthById;
const updateBirth = async (id, data) => {
    const birth = await prisma_1.prisma.birth.update({
        where: { id },
        data,
    });
    await (0, cacheVersion_1.bumpCacheVersion)("birth");
    return birth;
};
exports.updateBirth = updateBirth;
const deleteBirth = async (id) => {
    const birth = await prisma_1.prisma.birth.delete({ where: { id } });
    await (0, cacheVersion_1.bumpCacheVersion)("birth");
    return birth;
};
exports.deleteBirth = deleteBirth;
exports.searchBirth = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "birth",
    exactFields: ["fathersName", "mothersName", "mobileNumber"],
    prefixFields: ["fathersName", "mothersName"],
    similarFields: ["fathersName", "mothersName"],
    selectFields: [
        "id",
        "birthTime",
        "birthDate",
        "babySex",
        "babyWeightKg",
        "fathersName",
        "mothersName",
        "mobileNumber",
        "deliveryType",
        "placeOfBirth",
        "attendantsName",
        "createdAt",
    ],
});
const filterBirthsService = async (params) => {
    const { fromDate, toDate, babySex, deliveryType, cursor, limit } = params;
    const where = {};
    if (babySex) {
        where.babySex = {
            equals: babySex,
            mode: "insensitive",
        };
    }
    if (deliveryType) {
        where.deliveryType = {
            equals: deliveryType,
            mode: "insensitive",
        };
    }
    if (fromDate || toDate) {
        where.birthDate = {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "birth",
        limit,
    }, cursor, where);
};
exports.filterBirthsService = filterBirthsService;
