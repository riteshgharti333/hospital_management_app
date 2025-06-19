"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmission = exports.updateAdmission = exports.getAdmissionById = exports.getAllAdmissions = exports.createAdmission = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAdmission = async (data) => {
    return prisma.admission.create({ data });
};
exports.createAdmission = createAdmission;
const getAllAdmissions = async () => {
    return prisma.admission.findMany({ orderBy: { createdAt: 'desc' } });
};
exports.getAllAdmissions = getAllAdmissions;
const getAdmissionById = async (id) => {
    return prisma.admission.findUnique({ where: { id } });
};
exports.getAdmissionById = getAdmissionById;
const updateAdmission = async (id, data) => {
    return prisma.admission.update({
        where: { id },
        data,
    });
};
exports.updateAdmission = updateAdmission;
const deleteAdmission = async (id) => {
    return prisma.admission.delete({ where: { id } });
};
exports.deleteAdmission = deleteAdmission;
