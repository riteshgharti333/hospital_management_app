"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.getDepartmentByName = exports.getDepartmentById = exports.getAllDepartments = exports.createDepartment = void 0;
const prisma_1 = require("../lib/prisma");
const createDepartment = async (data) => {
    return prisma_1.prisma.department.create({ data });
};
exports.createDepartment = createDepartment;
const getAllDepartments = async () => {
    return prisma_1.prisma.department.findMany({ orderBy: { createdAt: "desc" } });
};
exports.getAllDepartments = getAllDepartments;
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
