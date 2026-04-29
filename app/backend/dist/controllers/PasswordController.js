"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordLoggedIn = exports.resetPassword = exports.verifyResetOtp = exports.forgotPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const statusCodes_1 = require("../constants/statusCodes");
const prisma_1 = require("../lib/prisma");
const passwordService_1 = require("../services/passwordService");
const sendEmail_1 = require("../utils/sendEmail");
const sendResponse_1 = require("../utils/sendResponse");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.forgotPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new errorHandler_1.ErrorHandler("Email is required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("No user found with this email", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    const otp = (0, passwordService_1.generateOTP)();
    await (0, passwordService_1.saveOTP)(email, otp);
    await (0, sendEmail_1.sendEmail)(email, "Your Password Reset OTP", `Your OTP is: ${otp}`);
    return res.status(statusCodes_1.StatusCodes.OK).json({
        success: true,
        message: "OTP sent to your email",
    });
});
exports.verifyResetOtp = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return next(new errorHandler_1.ErrorHandler("Email and OTP are required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
        return next(new errorHandler_1.ErrorHandler("OTP not found. Please request again.", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    if (Date.now() > user.resetTokenExpiry.getTime()) {
        return next(new errorHandler_1.ErrorHandler("OTP expired", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    if (user.resetToken !== otp) {
        return next(new errorHandler_1.ErrorHandler("Invalid OTP", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    // 🔐 Create a temporary reset token (JWT or UUID)
    const resetToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_RESET_SECRET, { expiresIn: "10m" });
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "OTP verified successfully",
        data: { resetToken },
    });
});
exports.resetPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return next(new errorHandler_1.ErrorHandler("Token and new password are required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    // Verify token
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_RESET_SECRET);
    }
    catch (err) {
        return next(new errorHandler_1.ErrorHandler("Invalid or expired token", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    // Get user
    const user = await prisma_1.prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("User not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    // Hash new password
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 12);
    // Update password + clear reset fields
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            mustChangePassword: false, // 🔥 important: first login completed
            resetToken: null,
            resetTokenExpiry: null,
        },
    });
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Password reset successfully. You can now log in.",
    });
});
exports.changePasswordLoggedIn = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return next(new errorHandler_1.ErrorHandler("Old password and new password are required", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("User not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    const isMatch = await bcrypt_1.default.compare(oldPassword, user.password);
    if (!isMatch) {
        return next(new errorHandler_1.ErrorHandler("Old password is incorrect", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    const hashed = await bcrypt_1.default.hash(newPassword, 12);
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { password: hashed, mustChangePassword: false },
    });
    return res.status(statusCodes_1.StatusCodes.OK).json({
        success: true,
        message: "Password updated successfully",
    });
});
