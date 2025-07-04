"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.updateUserDetails = exports.getUserById = exports.getUserByEmail = exports.createUser = void 0;
const prisma_1 = require("../lib/prisma");
const createUser = async (data) => {
    return prisma_1.prisma.user.create({ data });
};
exports.createUser = createUser;
// Get user by email (for login or checking duplicates)
const getUserByEmail = async (email) => {
    return prisma_1.prisma.user.findUnique({ where: { email } });
};
exports.getUserByEmail = getUserByEmail;
// Get user by ID
const getUserById = async (id) => {
    return prisma_1.prisma.user.findUnique({ where: { id } });
};
exports.getUserById = getUserById;
// Update user (name and email)
const updateUserDetails = async (id, data) => {
    return prisma_1.prisma.user.update({
        where: { id },
        data,
    });
};
exports.updateUserDetails = updateUserDetails;
// Update password
const updateUserPassword = async (id, hashedPassword) => {
    return prisma_1.prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
    });
};
exports.updateUserPassword = updateUserPassword;
