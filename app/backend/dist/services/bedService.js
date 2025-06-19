"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBed = exports.updateBed = exports.getBedsByWard = exports.getBedByNumber = exports.getBedById = exports.getAllBeds = exports.createBed = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBed = async (data) => {
    return prisma.bed.create({ data });
};
exports.createBed = createBed;
const getAllBeds = async () => {
    return prisma.bed.findMany({ orderBy: { createdAt: "desc" } });
};
exports.getAllBeds = getAllBeds;
const getBedById = async (id) => {
    return prisma.bed.findUnique({ where: { id } });
};
exports.getBedById = getBedById;
const getBedByNumber = async (bedNumber) => {
    return prisma.bed.findUnique({ where: { bedNumber } });
};
exports.getBedByNumber = getBedByNumber;
const getBedsByWard = async (wardNumber) => {
    return prisma.bed.findMany({ where: { wardNumber } });
};
exports.getBedsByWard = getBedsByWard;
const updateBed = async (id, data) => {
    return prisma.bed.update({
        where: { id },
        data,
    });
};
exports.updateBed = updateBed;
const deleteBed = async (id) => {
    return prisma.bed.delete({ where: { id } });
};
exports.deleteBed = deleteBed;
