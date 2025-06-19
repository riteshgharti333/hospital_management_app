"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendCookie = (user, res, message, statusCode = 200) => {
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
    res
        .status(statusCode)
        .cookie("hospital-token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        secure: process.env.NODE_ENV !== "development",
    })
        .json({
        success: true,
        message,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
};
exports.sendCookie = sendCookie;
