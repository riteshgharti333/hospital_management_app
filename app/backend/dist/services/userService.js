"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByRegId = exports.createDoctorUser = void 0;
const prisma_1 = require("../lib/prisma");
const createDoctorUser = async (data) => {
    return prisma_1.prisma.user.create({ data });
};
exports.createDoctorUser = createDoctorUser;
const getUserByRegId = async (regId) => {
    return prisma_1.prisma.user.findUnique({ where: { regId } });
};
exports.getUserByRegId = getUserByRegId;
