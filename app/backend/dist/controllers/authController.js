"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const authService_1 = require("../services/authService");
const schemas_1 = require("@hospital/schemas");
const validateWithZod_1 = require("../utils/validateWithZod");
const cookie_1 = require("../utils/cookie");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "60d";
// 🔐 Register
exports.register = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = (0, validateWithZod_1.validateWithZod)(schemas_1.authSchema, req.body);
    const existingUser = await (0, authService_1.getUserByEmail)(validated.email);
    if (existingUser) {
        return next(new errorHandler_1.ErrorHandler("Email already in use", statusCodes_1.StatusCodes.CONFLICT));
    }
    const hashedPassword = await bcrypt_1.default.hash(validated.password, 12);
    const user = await (0, authService_1.createUser)({
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "User registered successfully",
        data: { id: user.id, name: user.name, email: user.email },
    });
});
// 🔐 Login
exports.login = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await (0, authService_1.getUserByEmail)(email);
    if (!user) {
        return next(new errorHandler_1.ErrorHandler("Email not found", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new errorHandler_1.ErrorHandler("Invalid Email or Password", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    (0, cookie_1.sendCookie)({
        id: user.id,
        name: user.name,
        email: user.email,
    }, res, "Login successful", statusCodes_1.StatusCodes.OK);
});
exports.logout = (0, catchAsyncError_1.catchAsyncError)(async (req, res, _next) => {
    // Clear the cookie by setting it to an empty string and expiring immediately
    res.cookie("token", "", {
        httpOnly: true,
        sameSite: "lax", // or 'none' if cross-site cookies are needed with `secure: true`
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0), // expire immediately
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Logout successful",
    });
});
