"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByRegId = exports.regenerateTempPassword = exports.getUsersAggregated = exports.getUserByRegId = exports.createUserLogin = void 0;
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUserLogin = async (data) => {
    return prisma_1.prisma.user.create({
        data: {
            ...data,
            isActive: false,
            mustChangePassword: true,
        },
    });
};
exports.createUserLogin = createUserLogin;
const getUserByRegId = async (regId) => {
    return prisma_1.prisma.user.findUnique({ where: { regId } });
};
exports.getUserByRegId = getUserByRegId;
const STAFF_ROLES = ["DOCTOR", "NURSE"];
const sanitizeUser = (u) => ({
    id: u.id,
    regId: u.regId ?? null,
    name: u.name,
    email: u.email,
    role: u.role,
    mustChangePassword: u.mustChangePassword ?? false,
    status: u.isActive ? "active" : "disabled",
    permissions: u.permissions ?? {},
    createdAt: u.createdAt?.toISOString?.() ?? String(u.createdAt),
    updatedAt: u.updatedAt?.toISOString?.() ?? String(u.updatedAt),
});
const getUsersAggregated = async (params) => {
    const { role, skip = 0, take = 25 } = params;
    const where = {
        role: { in: STAFF_ROLES },
    };
    if (role && STAFF_ROLES.includes(role)) {
        where.role = role;
    }
    const [allUsers, totalUsers] = await Promise.all([
        prisma_1.prisma.user.findMany({
            where,
            skip,
            take,
            orderBy: { name: "asc" },
        }),
        prisma_1.prisma.user.count({ where }),
    ]);
    const [activeAccess, deniedAccess] = await Promise.all([
        prisma_1.prisma.user.count({ where: { ...where, isActive: true } }),
        prisma_1.prisma.user.count({ where: { ...where, isActive: false } }),
    ]);
    const groupData = await Promise.all(STAFF_ROLES.map(async (r) => {
        const users = await prisma_1.prisma.user.findMany({
            where: { role: r },
            orderBy: { name: "asc" },
        });
        return {
            role: r,
            count: users.length,
            users: users.map(sanitizeUser),
        };
    }));
    const grouped = {
        doctor: groupData.find((g) => g.role === "DOCTOR") ?? {
            count: 0,
            users: [],
        },
        nurse: groupData.find((g) => g.role === "NURSE") ?? {
            count: 0,
            users: [],
        },
    };
    return {
        all: {
            users: allUsers.map(sanitizeUser),
            total: totalUsers,
        },
        staff: grouped,
        totalUsers,
        activeAccess,
        deniedAccess,
    };
};
exports.getUsersAggregated = getUsersAggregated;
const regenerateTempPassword = async (regId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { regId },
    });
    if (!user) {
        return null;
    }
    if (!["DOCTOR", "NURSE"].includes(user.role)) {
        throw new Error("Temp password allowed only for staff users");
    }
    // 🔐 Generate new temp password
    const prefix = user.role === "DOCTOR" ? "Doc@" : "Nur@";
    const tempPassword = prefix + Math.floor(100000 + Math.random() * 900000);
    const hashed = await bcrypt_1.default.hash(tempPassword, 12);
    // 🔄 Update user credentials
    await prisma_1.prisma.user.update({
        where: { regId },
        data: {
            password: hashed,
            tempPasswordHash: hashed,
            mustChangePassword: true,
        },
    });
    return {
        regId: user.regId,
        tempPassword,
    };
};
exports.regenerateTempPassword = regenerateTempPassword;
const deleteUserByRegId = async (regId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { regId },
    });
    if (!user) {
        return null;
    }
    if (user.role === "ADMIN") {
        throw new Error("ADMIN_DELETE_NOT_ALLOWED");
    }
    await prisma_1.prisma.user.delete({
        where: { regId },
    });
    return {
        regId: user.regId,
        role: user.role,
        name: user.name,
    };
};
exports.deleteUserByRegId = deleteUserByRegId;
