"use strict";
// src/services/authService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUserByEmail = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create user (register)
const createUser = async (data) => {
    return prisma.user.create({ data });
};
exports.createUser = createUser;
// Get user by email (for login or checking duplicates)
const getUserByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } });
};
exports.getUserByEmail = getUserByEmail;
// Get user by ID (for auth middleware or profile)
const getUserById = async (id) => {
    return prisma.user.findUnique({ where: { id } });
};
exports.getUserById = getUserById;
// Optional: Update user details
const updateUser = async (id, data) => {
    return prisma.user.update({
        where: { id },
        data,
    });
};
exports.updateUser = updateUser;
// Optional: Delete user (soft delete or full delete)
const deleteUser = async (id) => {
    return prisma.user.delete({ where: { id } });
};
exports.deleteUser = deleteUser;
