"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDepartmentsService = exports.searchDepartment = exports.deleteDepartment = exports.updateDepartment = exports.getDepartmentByName = exports.getDepartmentById = exports.getAllDepartmentService = exports.createDepartment = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const filterPaginate_1 = require("../utils/filterPaginate");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const createDepartment = async (data) => {
    return prisma_1.prisma.department.create({ data });
};
exports.createDepartment = createDepartment;
const getAllDepartmentService = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "department",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllDepartmentService = getAllDepartmentService;
const getDepartmentById = async (id) => {
    return prisma_1.prisma.department.findUnique({ where: { id } });
};
exports.getDepartmentById = getDepartmentById;
const getDepartmentByName = async (name) => {
    return prisma_1.prisma.department.findUnique({ where: { name } });
};
exports.getDepartmentByName = getDepartmentByName;
const updateDepartment = async (id, data) => {
    return prisma_1.prisma.department.update({
        where: { id },
        data,
    });
};
exports.updateDepartment = updateDepartment;
const deleteDepartment = async (id) => {
    return prisma_1.prisma.department.delete({ where: { id } });
};
exports.deleteDepartment = deleteDepartment;
const commonSearchFields = ["name", "head"];
exports.searchDepartment = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Department",
    cacheKeyPrefix: "department",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
const filterDepartmentsService = async (filters) => {
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
        model: "department",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterDepartmentsService = filterDepartmentsService;
