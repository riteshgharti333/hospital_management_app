"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBirth = exports.updateBirth = exports.getBirthById = exports.getAllBirths = exports.createBirth = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBirth = async (data) => {
    return prisma.birth.create({ data });
};
exports.createBirth = createBirth;
const getAllBirths = async () => {
    return prisma.birth.findMany({ orderBy: { createdAt: "desc" } });
};
exports.getAllBirths = getAllBirths;
const getBirthById = async (id) => {
    return prisma.birth.findUnique({ where: { id } });
};
exports.getBirthById = getBirthById;
const updateBirth = async (id, data) => {
    return prisma.birth.update({
        where: { id },
        data,
    });
};
exports.updateBirth = updateBirth;
const deleteBirth = async (id) => {
    return prisma.birth.delete({ where: { id } });
};
exports.deleteBirth = deleteBirth;
