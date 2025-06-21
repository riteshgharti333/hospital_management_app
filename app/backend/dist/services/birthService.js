"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBirth = exports.updateBirth = exports.getBirthById = exports.getAllBirths = exports.createBirth = void 0;
const prisma_1 = require("../lib/prisma");
const createBirth = async (data) => {
    return prisma_1.prisma.birth.create({ data });
};
exports.createBirth = createBirth;
const getAllBirths = async () => {
    return prisma_1.prisma.birth.findMany({ orderBy: { createdAt: "desc" } });
};
exports.getAllBirths = getAllBirths;
const getBirthById = async (id) => {
    return prisma_1.prisma.birth.findUnique({ where: { id } });
};
exports.getBirthById = getBirthById;
const updateBirth = async (id, data) => {
    return prisma_1.prisma.birth.update({
        where: { id },
        data,
    });
};
exports.updateBirth = updateBirth;
const deleteBirth = async (id) => {
    return prisma_1.prisma.birth.delete({ where: { id } });
};
exports.deleteBirth = deleteBirth;
