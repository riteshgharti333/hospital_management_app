"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTokenCookie = exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Create Access Token (Short-Lived)
 */
const createAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "15m", // 🔥 Hardcoded → FIXES TYPE ERROR
    });
};
exports.createAccessToken = createAccessToken;
/**
 * Create Refresh Token (Long-Lived)
 */
const createRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d", // 🔥 Hardcoded → FIXES TYPE ERROR
    });
};
exports.createRefreshToken = createRefreshToken;
/**
 * Send JWT cookies
 */
const sendTokenCookie = (payload, res, message, statusCode) => {
    const accessToken = (0, exports.createAccessToken)(payload);
    const refreshToken = (0, exports.createRefreshToken)({ id: payload.id });
    // Access Token Cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    // Refresh Token Cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(statusCode).json({
        success: true,
        message,
        user: {
            id: payload.id,
            regId: payload.regId,
            name: payload.name,
            email: payload.email,
            role: payload.role,
        },
    });
};
exports.sendTokenCookie = sendTokenCookie;
////////////////////
