import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { StatusCodes } from "../constants/statusCodes";
import { prisma } from "../lib/prisma";
import {
  generateOTP,
  saveOTP,
  verifyOTPService,
  resetPasswordService,
} from "../services/passwordService";
import { sendEmail } from "../utils/sendEmail";
import { sendResponse } from "../utils/sendResponse";
import jwt from "jsonwebtoken";

export const forgotPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(
        new ErrorHandler("Email is required", StatusCodes.BAD_REQUEST)
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(
        new ErrorHandler("No user found with this email", StatusCodes.NOT_FOUND)
      );
    }

    const otp = generateOTP();
    await saveOTP(email, otp);

    await sendEmail(email, "Your Password Reset OTP", `Your OTP is: ${otp}`);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP sent to your email",
    });
  }
);

export const verifyResetOtp = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(
        new ErrorHandler("Email and OTP are required", StatusCodes.BAD_REQUEST)
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return next(
        new ErrorHandler(
          "OTP not found. Please request again.",
          StatusCodes.NOT_FOUND
        )
      );
    }

    if (Date.now() > user.resetTokenExpiry.getTime()) {
      return next(new ErrorHandler("OTP expired", StatusCodes.BAD_REQUEST));
    }

    if (user.resetToken !== otp) {
      return next(new ErrorHandler("Invalid OTP", StatusCodes.UNAUTHORIZED));
    }

    // 🔐 Create a temporary reset token (JWT or UUID)
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_RESET_SECRET!,
      { expiresIn: "10m" }
    );

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "OTP verified successfully",
      data: { resetToken },
    });
  }
);

export const resetPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return next(
        new ErrorHandler(
          "Token and new password are required",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_RESET_SECRET!);
    } catch (err) {
      return next(
        new ErrorHandler("Invalid or expired token", StatusCodes.UNAUTHORIZED)
      );
    }

    // Get user
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password + clear reset fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        mustChangePassword: false, // 🔥 important: first login completed
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password reset successfully. You can now log in.",
    });
  }
);


export const changePasswordLoggedIn = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(
        new ErrorHandler("Old password and new password are required", StatusCodes.BAD_REQUEST)
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(
        new ErrorHandler("Old password is incorrect", StatusCodes.UNAUTHORIZED)
      );
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed, mustChangePassword: false },
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Password updated successfully",
    });
  }
);