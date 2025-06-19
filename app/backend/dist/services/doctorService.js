"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctor = exports.updateDoctor = exports.getDoctorsByDepartment = exports.getDoctorByRegistration = exports.getDoctorById = exports.getAllDoctors = exports.createDoctor = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createDoctor = async (data) => {
    return prisma.doctor.create({ data });
};
exports.createDoctor = createDoctor;
const getAllDoctors = async () => {
    return prisma.doctor.findMany({ orderBy: { createdAt: "desc" } });
};
exports.getAllDoctors = getAllDoctors;
const getDoctorById = async (id) => {
    return prisma.doctor.findUnique({ where: { id } });
};
exports.getDoctorById = getDoctorById;
const getDoctorByRegistration = async (registrationNo) => {
    return prisma.doctor.findUnique({ where: { registrationNo } });
};
exports.getDoctorByRegistration = getDoctorByRegistration;
const getDoctorsByDepartment = async (department) => {
    return prisma.doctor.findMany({
        where: { department },
        orderBy: { fullName: "asc" },
    });
};
exports.getDoctorsByDepartment = getDoctorsByDepartment;
const updateDoctor = async (id, data) => {
    return prisma.doctor.update({ where: { id }, data });
};
exports.updateDoctor = updateDoctor;
const deleteDoctor = async (id) => {
    return prisma.doctor.delete({ where: { id } });
};
exports.deleteDoctor = deleteDoctor;
