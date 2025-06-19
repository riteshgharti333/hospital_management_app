"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProfileByEmail = exports.createProfile = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProfile = async (data) => {
    return prisma.profile.create({ data });
};
exports.createProfile = createProfile;
const findProfileByEmail = async (email) => {
    return prisma.profile.findUnique({ where: { email } });
};
exports.findProfileByEmail = findProfileByEmail;
