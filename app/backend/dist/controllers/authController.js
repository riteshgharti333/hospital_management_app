"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNewPasswordController = exports.loginUserController = exports.getUserByRegIdController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const authService_1 = require("../services/authService");
const cookie_1 = require("../utils/cookie");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const statusCodes_1 = require("../constants/statusCodes");
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
    // user must change password first time
    if (user.mustChangePassword) {
        return res.status(statusCodes_1.StatusCodes.OK).json({
            success: true,
            mustChangePassword: true,
            message: "You must set a new password",
            data: { userId: user.id },
        });
    }
    (0, cookie_1.sendTokenCookie)({
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
