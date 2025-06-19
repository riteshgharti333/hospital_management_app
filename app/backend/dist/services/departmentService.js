"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.getDepartmentByName = exports.getDepartmentById = exports.getAllDepartments = exports.createDepartment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createDepartment = async (data) => {
    return prisma.department.create({ data });
};
exports.createDepartment = createDepartment;
const getAllDepartments = async () => {
    return prisma.department.findMany({ orderBy: { createdAt: "desc" } });
};
exports.getAllDepartments = getAllDepartments;
const getDepartmentById = async (id) => {
    return prisma.department.findUnique({ where: { id } });
};
exports.getDepartmentById = getDepartmentById;
const getDepartmentByName = async (name) => {
    return prisma.department.findUnique({ where: { name } });
};
exports.getDepartmentByName = getDepartmentByName;
const updateDepartment = async (id, data) => {
    return prisma.department.update({
        where: { id },
        data,
    });
};
exports.updateDepartment = updateDepartment;
const deleteDepartment = async (id) => {
    return prisma.department.delete({ where: { id } });
};
exports.deleteDepartment = deleteDepartment;
