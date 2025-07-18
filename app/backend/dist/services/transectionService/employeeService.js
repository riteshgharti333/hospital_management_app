"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.updateEmployee = exports.getEmployeesByDepartment = exports.getEmployeeByVoterId = exports.getEmployeeByAadhar = exports.getEmployeeByEmail = exports.getEmployeeById = exports.getAllEmployees = exports.createEmployee = void 0;
const prisma_1 = require("../../lib/prisma");
const createEmployee = async (data) => {
    return prisma_1.prisma.employee.create({ data });
};
exports.createEmployee = createEmployee;
const getAllEmployees = async () => {
    return prisma_1.prisma.employee.findMany({
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllEmployees = getAllEmployees;
const getEmployeeById = async (id) => {
    return prisma_1.prisma.employee.findUnique({ where: { id } });
};
exports.getEmployeeById = getEmployeeById;
const getEmployeeByEmail = async (email) => {
    return prisma_1.prisma.employee.findUnique({ where: { email } });
};
exports.getEmployeeByEmail = getEmployeeByEmail;
const getEmployeeByAadhar = async (aadharNo) => {
    return prisma_1.prisma.employee.findUnique({ where: { aadharNo } });
};
exports.getEmployeeByAadhar = getEmployeeByAadhar;
const getEmployeeByVoterId = async (voterId) => {
    return prisma_1.prisma.employee.findUnique({ where: { voterId } });
};
exports.getEmployeeByVoterId = getEmployeeByVoterId;
const getEmployeesByDepartment = async (department) => {
    return prisma_1.prisma.employee.findMany({
        where: { department },
        orderBy: { employeeName: "asc" },
    });
};
exports.getEmployeesByDepartment = getEmployeesByDepartment;
const updateEmployee = async (id, data) => {
    return prisma_1.prisma.employee.update({
        where: { id },
        data,
    });
};
exports.updateEmployee = updateEmployee;
const deleteEmployee = async (id) => {
    return prisma_1.prisma.employee.delete({ where: { id } });
};
exports.deleteEmployee = deleteEmployee;
