"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserRecord = exports.regenerateStaffTempPassword = exports.getAllUsers = exports.toggleStaffAccess = exports.createStaffAccess = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const statusCodes_1 = require("../constants/statusCodes");
const prisma_1 = require("../lib/prisma");
const userService_1 = require("../services/userService");
const sendResponse_1 = require("../utils/sendResponse");
// CREATE ACCESS (Doctor or Nurse)
exports.createStaffAccess = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { regId } = req.body;
    if (!regId) {
        return next(new errorHandler_1.ErrorHandler("Registration ID required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    let staff = null;
    let role;
    // Detect staff type
    if (regId.startsWith("DOC-")) {
        staff = await prisma_1.prisma.doctor.findUnique({
            where: { registrationNo: regId },
            select: { fullName: true, email: true, registrationNo: true },
        });
        role = "DOCTOR";
    }
    else if (regId.startsWith("NUR-")) {
        staff = await prisma_1.prisma.nurse.findUnique({
            where: { registrationNo: regId },
            select: { fullName: true, email: true, registrationNo: true },
        });
        role = "NURSE";
    }
    else {
        return next(new errorHandler_1.ErrorHandler("Invalid registration format", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    if (!staff) {
        return next(new errorHandler_1.ErrorHandler("Staff not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    const existing = await (0, userService_1.getUserByRegId)(regId);
    if (existing) {
        return next(new errorHandler_1.ErrorHandler("Login already created for this user", statusCodes_1.StatusCodes.CONFLICT));
    }
    // 🔐 Generate temp password
    const tempPassword = (role === "DOCTOR" ? "Doc@" : "Nur@") +
        Math.floor(100000 + Math.random() * 900000);
    const hashed = await bcrypt_1.default.hash(tempPassword, 12);
    // ✅ Store hashed password + tempPasswordHash
    const newUser = await prisma_1.prisma.user.create({
        data: {
            regId,
            name: staff.fullName,
            email: staff.email,
            role,
            password: hashed,
            mustChangePassword: true,
            isActive: false,
        },
    });
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: `${role} access created successfully`,
        data: {
            regId: newUser.regId,
            name: newUser.name,
            email: newUser.email,
            role,
            tempPassword,
            status: "DISABLED",
        },
    });
});
// TOGGLE ACCESS (doctor or nurse)
exports.toggleStaffAccess = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { regId, action } = req.body;
    if (!regId) {
        return next(new errorHandler_1.ErrorHandler("regId required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { regId } });
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("User login not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    if (!["ENABLE", "DISABLE"].includes(action)) {
        return next(new errorHandler_1.ErrorHandler("Action must be ENABLE or DISABLE", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const updated = await prisma_1.prisma.user.update({
        where: { regId },
        data: { isActive: action === "ENABLE" },
    });
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: `Access ${action === "ENABLE" ? "enabled" : "disabled"} successfully`,
        data: {
            regId: updated.regId,
            name: updated.name,
            role: updated.role,
            status: updated.isActive ? "ACTIVE" : "DISABLED",
        },
    });
});
exports.getAllUsers = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const rawRole = req.query.role || undefined;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.max(1, Number(req.query.limit || 25));
    // ❌ ADMIN removed
    const allowedRoles = ["DOCTOR", "NURSE"];
    let role = undefined;
    if (rawRole) {
        const upperRole = rawRole.toUpperCase();
        if (!allowedRoles.includes(upperRole)) {
            return next(new errorHandler_1.ErrorHandler("Invalid role query", statusCodes_1.StatusCodes.BAD_REQUEST));
        }
        role = upperRole;
    }
    const offset = (page - 1) * limit;
    const data = await (0, userService_1.getUsersAggregated)({
        role,
        skip: offset,
        take: limit,
    });
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Users fetched successfully",
        data: {
            page,
            limit,
            ...data,
        },
    });
});
exports.regenerateStaffTempPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { regId } = req.body;
    if (!regId) {
        return next(new errorHandler_1.ErrorHandler("regId is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const result = await (0, userService_1.regenerateTempPassword)(regId);
    if (!result) {
        return next(new errorHandler_1.ErrorHandler("User not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Temporary password regenerated successfully",
        data: {
            regId: result.regId,
            tempPassword: result.tempPassword,
        },
    });
});
exports.deleteUserRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { regId } = req.params;
    if (!regId) {
        return next(new errorHandler_1.ErrorHandler("regId is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    try {
        const deletedUser = await (0, userService_1.deleteUserByRegId)(regId);
        if (!deletedUser) {
            return next(new errorHandler_1.ErrorHandler("User not found", statusCodes_1.StatusCodes.NOT_FOUND));
        }
        return (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.OK,
            message: "User deleted successfully",
            data: deletedUser,
        });
    }
    catch (error) {
        if (error.message === "ADMIN_DELETE_NOT_ALLOWED") {
            return next(new errorHandler_1.ErrorHandler("Admin users cannot be deleted", statusCodes_1.StatusCodes.FORBIDDEN));
        }
        return next(new errorHandler_1.ErrorHandler("Failed to delete user", statusCodes_1.StatusCodes.INTERNAL_ERROR));
    }
});
