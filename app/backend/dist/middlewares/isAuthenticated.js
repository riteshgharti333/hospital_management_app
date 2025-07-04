"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const statusCodes_1 = require("../constants/statusCodes");
const prisma_1 = require("../lib/prisma");
const isAuthenticated = async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        return next(new errorHandler_1.ErrorHandler("Login Required", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
            },
        });
        if (!user) {
            return next(new errorHandler_1.ErrorHandler("User not found", statusCodes_1.StatusCodes.UNAUTHORIZED));
        }
        req.user = user;
        next();
    }
    catch {
        return next(new errorHandler_1.ErrorHandler("Invalid token", statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
};
exports.isAuthenticated = isAuthenticated;
