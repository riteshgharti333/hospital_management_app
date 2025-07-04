"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTokenCookie = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "90d" });
};
exports.createAccessToken = createAccessToken;
const sendTokenCookie = (payload, res, message, statusCode) => {
    const accessToken = (0, exports.createAccessToken)(payload);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 90 * 24 * 60 * 60 * 1000,
    });
    res.status(statusCode).json({
        success: true,
        message,
    });
};
exports.sendTokenCookie = sendTokenCookie;
