"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNurse = exports.updateNurse = exports.getNurseByRegistration = exports.getNurseById = exports.getAllNurses = exports.createNurse = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNurse = async (data) => {
    return prisma.nurse.create({ data });
};
exports.createNurse = createNurse;
const getAllNurses = async () => {
    return prisma.nurse.findMany({ orderBy: { createdAt: "desc" } });
};
exports.getAllNurses = getAllNurses;
const getNurseById = async (id) => {
    return prisma.nurse.findUnique({ where: { id } });
};
exports.getNurseById = getNurseById;
const getNurseByRegistration = async (registrationNo) => {
    return prisma.nurse.findUnique({ where: { registrationNo } });
};
exports.getNurseByRegistration = getNurseByRegistration;
const updateNurse = async (id, data) => {
    return prisma.nurse.update({
        where: { id },
        data,
    });
};
exports.updateNurse = updateNurse;
const deleteNurse = async (id) => {
    return prisma.nurse.delete({ where: { id } });
};
exports.deleteNurse = deleteNurse;
