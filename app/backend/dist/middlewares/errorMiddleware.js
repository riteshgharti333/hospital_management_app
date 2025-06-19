"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const errorHandler_1 = require("./errorHandler");
const mongoose_1 = __importDefault(require("mongoose"));
const errorMiddleware = (err, _req, res, _next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    // ZOD Error
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    }
    // Custom ErrorHandler
    else if (err instanceof errorHandler_1.ErrorHandler) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Mongoose Validation
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message);
    }
    // Duplicate Key Error (for Mongoose/Prisma)
    else if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field: ${field}`;
    }
    else {
        console.error("Unhandled Error 💥", err);
    }
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
};
exports.errorMiddleware = errorMiddleware;
