"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.updateUserDetails = exports.getUserById = exports.getUserByEmail = exports.createUser = void 0;
const prisma_1 = require("../lib/prisma");
const createUser = async (data) => {
    return prisma_1.prisma.user.create({
        data,
        select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.createUser = createUser;
const getUserByEmail = async (email) => {
    return prisma_1.prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.getUserByEmail = getUserByEmail;
const getUserById = async (id) => {
    return prisma_1.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.getUserById = getUserById;
const updateUserDetails = async (id, data) => {
    return prisma_1.prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.updateUserDetails = updateUserDetails;
const updateUserPassword = async (id, hashedPassword) => {
    return prisma_1.prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
        select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.updateUserPassword = updateUserPassword;
