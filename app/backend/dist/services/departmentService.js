"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDepartmentsService = exports.searchDepartment = exports.deleteDepartment = exports.updateDepartment = exports.getDepartmentById = exports.getAllDepartments = exports.createDepartment = void 0;
const prisma_1 = require("../lib/prisma");
const cacheVersion_1 = require("../utils/cacheVersion");
const filterPaginate_1 = require("../utils/filterPaginate");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const createDepartment = async (data) => {
    const department = await prisma_1.prisma.department.create({
        data: {
            ...data,
            status: data.status || "ACTIVE",
        },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("department");
    return department;
};
exports.createDepartment = createDepartment;
const getAllDepartments = async (cursor) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "department",
        include: {
            head: {
                select: {
                    fullName: true,
                },
            },
        },
    }, cursor);
};
exports.getAllDepartments = getAllDepartments;
const getDepartmentById = async (id) => {
    return prisma_1.prisma.department.findUnique({
        where: { id },
        include: {
            head: {
                select: {
                    id: true,
                    fullName: true,
                },
            },
        },
    });
};
exports.getDepartmentById = getDepartmentById;
const updateDepartment = async (id, data) => {
    const department = await prisma_1.prisma.department.update({
        where: { id },
        data,
    });
    await (0, cacheVersion_1.bumpCacheVersion)("department");
    return department;
};
exports.updateDepartment = updateDepartment;
const deleteDepartment = async (id) => {
    const department = await prisma_1.prisma.department.delete({ where: { id } });
    await (0, cacheVersion_1.bumpCacheVersion)("department");
    return department;
};
exports.deleteDepartment = deleteDepartment;
exports.searchDepartment = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Department",
    exactFields: ["name"],
    prefixFields: ["name"],
    similarFields: ["name", "description"],
    relationFields: {
        doctor: ["fullName"],
    },
    include: {
        head: {
            select: {
                id: true,
                fullName: true,
            },
        },
    },
    sortField: "createdAt",
});
const filterDepartmentsService = async (params) => {
    const { fromDate, toDate, status, cursor } = params;
    const where = {};
    // ✅ Status filter
    if (status) {
        where.status = status.toUpperCase();
    }
    // ✅ Date range filter
    if (fromDate || toDate) {
        where.createdAt = {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "department",
    }, cursor, where);
};
exports.filterDepartmentsService = filterDepartmentsService;
