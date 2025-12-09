"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBed = exports.deleteBed = exports.updateBed = exports.getBedsByWard = exports.getBedByNumber = exports.getBedById = exports.getAllBeds = exports.createBed = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const createBed = async (data) => {
    return prisma_1.prisma.bed.create({ data });
};
exports.createBed = createBed;
const getAllBeds = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "bed",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllBeds = getAllBeds;
const getBedById = async (id) => {
    return prisma_1.prisma.bed.findUnique({ where: { id } });
};
exports.getBedById = getBedById;
const getBedByNumber = async (bedNumber) => {
    return prisma_1.prisma.bed.findUnique({ where: { bedNumber } });
};
exports.getBedByNumber = getBedByNumber;
const getBedsByWard = async (wardNumber) => {
    return prisma_1.prisma.bed.findMany({ where: { wardNumber } });
};
exports.getBedsByWard = getBedsByWard;
const updateBed = async (id, data) => {
    return prisma_1.prisma.bed.update({
        where: { id },
        data,
    });
};
exports.updateBed = updateBed;
const deleteBed = async (id) => {
    return prisma_1.prisma.bed.delete({ where: { id } });
};
exports.deleteBed = deleteBed;
const commonSearchFields = ["bedNumber", "wardNumber"];
exports.searchBed = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Bed",
    cacheKeyPrefix: "bed",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
