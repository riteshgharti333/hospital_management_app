"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const statusCodes_1 = require("../constants/statusCodes");
const isAuthenticated = (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        return next(new errorHandler_1.ErrorHandler("Not authenticated", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        return next(new errorHandler_1.ErrorHandler("Invalid token", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
};
exports.isAuthenticated = isAuthenticated;
