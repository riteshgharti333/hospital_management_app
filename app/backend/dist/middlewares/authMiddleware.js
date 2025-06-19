"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncError_1 = require("./catchAsyncError");
const errorHandler_1 = require("./errorHandler");
exports.isAuthenticated = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(new errorHandler_1.ErrorHandler("Unauthorized: No token provided", 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default_secret_key");
        req.user = { id: decoded.id };
        next();
    }
    catch (err) {
        return next(new errorHandler_1.ErrorHandler("Unauthorized: Invalid or expired token", 401));
    }
});
