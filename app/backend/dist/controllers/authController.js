"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.changePassword = exports.updateProfile = exports.getMyProfile = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const authService_1 = require("../services/authService");
const cookie_1 = require("../utils/cookie");
const schemas_1 = require("@hospital/schemas");
// REGISTER
exports.register = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.registerSchema.parse(req.body);
    const existingUser = await (0, authService_1.getUserByEmail)(validated.email);
    if (existingUser) {
        return next(new errorHandler_1.ErrorHandler("Email already in use", statusCodes_1.StatusCodes.CONFLICT));
    }
    const hashedPassword = await bcrypt_1.default.hash(validated.password, 12);
    const isAdmin = validated.email === process.env.ADMIN_EMAIL;
    const user = await (0, authService_1.createUser)({
        name: validated.name ?? "",
        email: validated.email,
        password: hashedPassword,
        isAdmin,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "User registered successfully",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    });
});
// LOGIN
exports.login = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { email, password } = schemas_1.loginSchema.parse(req.body);
    const user = await (0, authService_1.getUserByEmail)(email);
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("Email not found", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new errorHandler_1.ErrorHandler("Invalid Email or Password", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    (0, cookie_1.sendTokenCookie)({
        id: user.id,
        name: user.name,
        email: user.email,
    }, res, "Login successful", statusCodes_1.StatusCodes.OK);
});
// LOGOUT
exports.logout = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    res.cookie("accessToken", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Logout successfully",
    });
});
// GET MY PROFILE
exports.getMyProfile = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
        return next(new errorHandler_1.ErrorHandler("Unauthorized", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    const user = await (0, authService_1.getUserById)(userId);
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("User not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "User profile fetched successfully",
        data: user,
    });
});
// UPDATE PROFILE
exports.updateProfile = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const userId = req.user?.id;
    const { name, email } = req.body;
    if (!userId) {
        return next(new errorHandler_1.ErrorHandler("Unauthorized", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    const updatedUser = await (0, authService_1.updateUserDetails)(userId, { name, email });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Profile updated successfully",
        data: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
        },
    });
});
// CHANGE PASSWORD
exports.changePassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    if (!userId) {
        return next(new errorHandler_1.ErrorHandler("Unauthorized", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    const user = await (0, authService_1.getUserById)(userId);
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("User not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    const isMatch = await bcrypt_1.default.compare(oldPassword, user.password);
    if (!isMatch) {
        return next(new errorHandler_1.ErrorHandler("Old password is incorrect", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 12);
    await (0, authService_1.updateUserPassword)(userId, hashedNewPassword);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Password updated successfully",
    });
});
// REFRESH ACCESS TOKEN
exports.refreshAccessToken = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return next(new errorHandler_1.ErrorHandler("Refresh token missing", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = (0, cookie_1.createAccessToken)({
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
        });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "development",
            maxAge: 60 * 60 * 1000,
        });
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.OK,
            message: "Access token refreshed",
        });
    }
    catch (error) {
        return next(new errorHandler_1.ErrorHandler("Invalid or expired refresh token", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
});
