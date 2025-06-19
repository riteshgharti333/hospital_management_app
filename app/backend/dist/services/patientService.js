"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.getPatientByAadhaar = exports.getPatientById = exports.getAllPatients = exports.createPatient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPatient = async (data) => {
    return prisma.patient.create({ data });
};
exports.createPatient = createPatient;
const getAllPatients = async () => {
    return prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
};
exports.getAllPatients = getAllPatients;
const getPatientById = async (id) => {
    return prisma.patient.findUnique({ where: { id } });
};
exports.getPatientById = getPatientById;
const getPatientByAadhaar = async (aadhaarNumber) => {
    return prisma.patient.findUnique({ where: { aadhaarNumber } });
};
exports.getPatientByAadhaar = getPatientByAadhaar;
const updatePatient = async (id, data) => {
    return prisma.patient.update({
        where: { id },
        data,
    });
};
exports.updatePatient = updatePatient;
const deletePatient = async (id) => {
    return prisma.patient.delete({ where: { id } });
};
exports.deletePatient = deletePatient;
