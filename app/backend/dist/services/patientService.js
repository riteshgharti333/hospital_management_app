"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.getPatientById = exports.getAllPatients = exports.createPatient = void 0;
const prisma_1 = require("../lib/prisma");
const createPatient = async (data) => {
    return prisma_1.prisma.patient.create({ data });
};
exports.createPatient = createPatient;
const getAllPatients = async () => {
    return prisma_1.prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
};
exports.getAllPatients = getAllPatients;
const getPatientById = async (id) => {
    return prisma_1.prisma.patient.findUnique({ where: { id } });
};
exports.getPatientById = getPatientById;
// export const getPatientByAadhaar = async (aadhaarNumber: string) => {
//   return prisma.patient.findUnique({ where: { aadhaarNumber } });
// };
const updatePatient = async (id, data) => {
    return prisma_1.prisma.patient.update({
        where: { id },
        data,
    });
};
exports.updatePatient = updatePatient;
const deletePatient = async (id) => {
    return prisma_1.prisma.patient.delete({ where: { id } });
};
exports.deletePatient = deletePatient;
