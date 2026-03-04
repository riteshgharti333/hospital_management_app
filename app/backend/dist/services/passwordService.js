"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.verifyOTPService = exports.saveOTP = exports.generateOTP = void 0;
const prisma_1 = require("../lib/prisma");
const crypto_1 = __importDefault(require("crypto"));
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
};
exports.generateOTP = generateOTP;
const saveOTP = async (email, otp) => {
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes
    return prisma_1.prisma.user.update({
        where: { email },
        data: {
            resetToken: otp,
            resetTokenExpiry: expiry,
        },
    });
};
exports.saveOTP = saveOTP;
const verifyOTPService = async (email, otp) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user || user.resetToken !== otp)
        return null;
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date())
        return null;
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    await prisma_1.prisma.user.update({
        where: { email },
        data: {
            resetToken,
            resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes valid
        },
    });
    return resetToken;
};
exports.verifyOTPService = verifyOTPService;
const resetPasswordService = async (token, newPassword) => {
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() },
        },
    });
    return user;
};
exports.resetPasswordService = resetPasswordService;
