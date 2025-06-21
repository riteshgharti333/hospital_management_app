"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const statusCodes_1 = require("../constants/statusCodes");
const cookie_1 = require("../utils/cookie");
const sendResponse_1 = require("../utils/sendResponse");
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
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
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
