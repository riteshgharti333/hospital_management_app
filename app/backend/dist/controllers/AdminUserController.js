"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.giveDoctorAccess = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const statusCodes_1 = require("../constants/statusCodes");
const prisma_1 = require("../lib/prisma");
const userService_1 = require("../services/userService");
const sendResponse_1 = require("../utils/sendResponse");
exports.giveDoctorAccess = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { regId } = req.body; // Example: DOC-101
    if (!regId || !regId.startsWith("DOC-")) {
        return next(new errorHandler_1.ErrorHandler("Invalid doctor registration number", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    // Step 1: Look up doctor in Doctor table
    const doctor = await prisma_1.prisma.doctor.findUnique({
        where: { registrationNo: regId },
    });
    if (!doctor) {
        return next(new errorHandler_1.ErrorHandler("Doctor not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    // Step 2: Check if doctor already has login access
    const existingUser = await (0, userService_1.getUserByRegId)(regId);
    if (existingUser) {
        return next(new errorHandler_1.ErrorHandler("Login already created for this doctor", statusCodes_1.StatusCodes.CONFLICT));
    }
    // Step 3: Generate temporary password
    const tempPassword = "Doc@" + Math.floor(100000 + Math.random() * 900000);
    const hashed = await bcrypt_1.default.hash(tempPassword, 12);
    // Step 4: Create User Login
    const newUser = await (0, userService_1.createDoctorUser)({
        regId,
        name: doctor.fullName,
        email: doctor.email,
        role: "DOCTOR",
        password: hashed,
    });
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Doctor login access created successfully",
        data: {
            regId: newUser.regId,
            name: newUser.name,
            email: newUser.email,
            tempPassword,
        },
    });
});
