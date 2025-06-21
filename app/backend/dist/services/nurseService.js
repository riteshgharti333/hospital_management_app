"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNurse = exports.updateNurse = exports.getNurseByRegistration = exports.getNurseById = exports.getAllNurses = exports.createNurse = void 0;
const prisma_1 = require("../lib/prisma");
const createNurse = async (data) => {
    return prisma_1.prisma.nurse.create({ data });
};
exports.createNurse = createNurse;
const getAllNurses = async () => {
    return prisma_1.prisma.nurse.findMany({ orderBy: { createdAt: "desc" } });
};
exports.getAllNurses = getAllNurses;
const getNurseById = async (id) => {
    return prisma_1.prisma.nurse.findUnique({ where: { id } });
};
exports.getNurseById = getNurseById;
const getNurseByRegistration = async (registrationNo) => {
    return prisma_1.prisma.nurse.findUnique({ where: { registrationNo } });
};
exports.getNurseByRegistration = getNurseByRegistration;
const updateNurse = async (id, data) => {
    return prisma_1.prisma.nurse.update({
        where: { id },
        data,
    });
};
exports.updateNurse = updateNurse;
const deleteNurse = async (id) => {
    return prisma_1.prisma.nurse.delete({ where: { id } });
};
exports.deleteNurse = deleteNurse;
