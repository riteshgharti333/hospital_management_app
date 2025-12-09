"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.updateUserPassword = exports.createUser = exports.findUserByRegId = void 0;
const prisma_1 = require("../lib/prisma");
const findUserByRegId = async (regId) => {
    return prisma_1.prisma.user.findUnique({
        where: { regId },
    });
};
exports.findUserByRegId = findUserByRegId;
const createUser = async (data) => {
    return prisma_1.prisma.user.create({ data });
};
exports.createUser = createUser;
const updateUserPassword = async (id, hashedPassword) => {
    return prisma_1.prisma.user.update({
        where: { id },
        data: { password: hashedPassword, mustChangePassword: false },
    });
};
exports.updateUserPassword = updateUserPassword;
const getUserById = async (id) => {
    return prisma_1.prisma.user.findUnique({ where: { id } });
};
exports.getUserById = getUserById;
