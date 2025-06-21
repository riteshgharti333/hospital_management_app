"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmission = exports.updateAdmission = exports.getAdmissionById = exports.getAllAdmissions = exports.createAdmission = void 0;
const prisma_1 = require("../lib/prisma");
const createAdmission = async (data) => {
    return prisma_1.prisma.admission.create({ data });
};
exports.createAdmission = createAdmission;
const getAllAdmissions = async () => {
    return prisma_1.prisma.admission.findMany({ orderBy: { createdAt: 'desc' } });
};
exports.getAllAdmissions = getAllAdmissions;
const getAdmissionById = async (id) => {
    return prisma_1.prisma.admission.findUnique({ where: { id } });
};
exports.getAdmissionById = getAdmissionById;
const updateAdmission = async (id, data) => {
    return prisma_1.prisma.admission.update({
        where: { id },
        data,
    });
};
exports.updateAdmission = updateAdmission;
const deleteAdmission = async (id) => {
    return prisma_1.prisma.admission.delete({ where: { id } });
};
exports.deleteAdmission = deleteAdmission;
