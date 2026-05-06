"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordController = exports.refreshAccessTokenController = exports.logoutUser = exports.updateProfile = exports.getProfile = exports.setNewPasswordController = exports.loginUserController = exports.getUserByRegIdController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService_1 = require("../services/authService");
const cookie_1 = require("../utils/cookie");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const statusCodes_1 = require("../constants/statusCodes");
const sendResponse_1 = require("../utils/sendResponse");
const prisma_1 = require("../lib/prisma");
const schemas_1 = require("@hospital/schemas");
/**
 * STEP 1 — USER ENTERS REG ID → RETURN NAME + EMAIL + ROLE
 */
exports.getUserByRegIdController = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { regId } = req.body;
    if (!regId) {
        return next(new errorHandler_1.ErrorHandler("Reg ID is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const user = await (0, authService_1.findUserByRegId)(regId);
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("No user found with this Reg ID", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    if (!user.isActive) {
        return next(new errorHandler_1.ErrorHandler("User is disabled by admin", statusCodes_1.StatusCodes.FORBIDDEN));
    }
    return res.status(statusCodes_1.StatusCodes.OK).json({
        success: true,
        message: "User found",
        data: {
            regId: user.regId,
            name: user.name,
            email: user.email,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
        },
    });
});
/**
 * STEP 2 — LOGIN WITH PASSWORD
 */
exports.loginUserController = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { regId, password } = req.body;
    if (!regId || !password) {
        return next(new errorHandler_1.ErrorHandler("Reg ID and Password required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const user = await (0, authService_1.findUserByRegId)(regId);
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("Invalid Reg ID or Password", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    if (!user.isActive) {
        return next(new errorHandler_1.ErrorHandler("User disabled by admin", statusCodes_1.StatusCodes.FORBIDDEN));
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return next(new errorHandler_1.ErrorHandler("Invalid Reg ID or Password", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    // ⛔ REMOVE mustChangePassword check
    // User can always log in normally
    return (0, cookie_1.sendTokenCookie)({
        id: user.id,
        regId: user.regId,
        name: user.name,
        email: user.email,
        role: user.role,
    }, res, "Login successful", statusCodes_1.StatusCodes.OK);
});
/**
 * STEP 3 — USER SETS NEW PASSWORD ON FIRST LOGIN
 */
exports.setNewPasswordController = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
        return next(new errorHandler_1.ErrorHandler("New password is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const user = await (0, authService_1.getUserById)(userId);
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("User not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    const hashed = await bcrypt_1.default.hash(newPassword, 12);
    await (0, authService_1.updateUserPassword)(userId, hashed);
    return res.status(statusCodes_1.StatusCodes.OK).json({
        success: true,
        message: "Password updated successfully. You can now log in.",
    });
});
// ===============================
// GET PROFILE
// ===============================
exports.getProfile = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
        return next(new errorHandler_1.ErrorHandler("Unauthorized", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("User not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Profile fetched successfully",
        data: user,
    });
});
// ===============================
// UPDATE PROFILE (name + email)
// ===============================
exports.updateProfile = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
        return next(new errorHandler_1.ErrorHandler("Unauthorized", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    // 🛡️ Defensive check (extra safety)
    if (req.user?.role !== "ADMIN") {
        return next(new errorHandler_1.ErrorHandler("Only admin can update profile", statusCodes_1.StatusCodes.FORBIDDEN));
    }
    const { name, email } = req.body;
    const updated = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: {
            ...(name && { name }),
            ...(email && { email }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Profile updated successfully",
        data: updated,
    });
});
// ===============================
// LOGOUT
// ===============================
exports.logoutUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Logged out successfully",
    });
});
/////////////////
exports.refreshAccessTokenController = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return next(new errorHandler_1.ErrorHandler("Refresh token missing", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    // 🔐 Verify refresh token
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    }
    catch {
        return next(new errorHandler_1.ErrorHandler("Invalid or expired refresh token", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    // 🔎 Fetch user
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: decoded.id },
    });
    if (!user || !user.isActive) {
        return next(new errorHandler_1.ErrorHandler("User not authorized", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    // 🎟️ Create new access token
    const newAccessToken = (0, cookie_1.createAccessToken)({
        id: user.id,
        regId: user.regId,
        name: user.name,
        email: user.email,
        role: user.role,
    });
    // 🍪 Update access token cookie
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
    });
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Access token refreshed successfully",
    });
});
////////////////
exports.changePasswordController = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const parsed = schemas_1.changePasswordSchema.parse(req.body);
    const { currentPassword, newPassword } = parsed;
    const userId = req.user?.id;
    if (!userId) {
        return next(new errorHandler_1.ErrorHandler("Unauthorized", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    const user = await (0, authService_1.getUserById)(userId);
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("User not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    // 🔐 VERIFY CURRENT PASSWORD
    const isMatch = await bcrypt_1.default.compare(currentPassword, user.password);
    if (!isMatch) {
        return next(new errorHandler_1.ErrorHandler("Current password is incorrect", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    // 🚫 PREVENT USING SAME PASSWORD
    const isSamePassword = await bcrypt_1.default.compare(newPassword, user.password);
    if (isSamePassword) {
        return next(new errorHandler_1.ErrorHandler("New password cannot be the same as the current password", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    // 🔒 HASH NEW PASSWORD
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 12);
    // ✅ UPDATE PASSWORD
    await (0, authService_1.updateUserPassword)(userId, hashedPassword);
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Password updated successfully",
    });
});
