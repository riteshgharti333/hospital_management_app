import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByRegId,
  getUserById,
  updateUserPassword,
} from "../services/authService";
import { sendTokenCookie } from "../utils/cookie";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { StatusCodes } from "../constants/statusCodes";
import { sendResponse } from "../utils/sendResponse";
import { prisma } from "../lib/prisma";

/**
 * STEP 1 — USER ENTERS REG ID → RETURN NAME + EMAIL + ROLE
 */
export const getUserByRegIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { regId } = req.body;

    if (!regId) {
      return next(
        new ErrorHandler("Reg ID is required", StatusCodes.BAD_REQUEST)
      );
    }

    const user = await findUserByRegId(regId);
    if (!user) {
      return next(
        new ErrorHandler(
          "No user found with this Reg ID",
          StatusCodes.NOT_FOUND
        )
      );
    }

    if (!user.isActive) {
      return next(
        new ErrorHandler("User is disabled by admin", StatusCodes.FORBIDDEN)
      );
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User found",
      data: {
        regId: user.regId,
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    });
  }
);

/**
 * STEP 2 — LOGIN WITH PASSWORD
 */
export const loginUserController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { regId, password } = req.body;

    if (!regId || !password) {
      return next(
        new ErrorHandler(
          "Reg ID and Password required",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const user = await findUserByRegId(regId);
    if (!user) {
      return next(
        new ErrorHandler("Invalid Reg ID or Password", StatusCodes.UNAUTHORIZED)
      );
    }

    if (!user.isActive) {
      return next(
        new ErrorHandler("User disabled by admin", StatusCodes.FORBIDDEN)
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(
        new ErrorHandler("Invalid Reg ID or Password", StatusCodes.UNAUTHORIZED)
      );
    }

    // ⛔ REMOVE mustChangePassword check
    // User can always log in normally

    return sendTokenCookie(
      {
        id: user.id,
        regId: user.regId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      res,
      "Login successful",
      StatusCodes.OK
    );
  }
);

/**
 * STEP 3 — USER SETS NEW PASSWORD ON FIRST LOGIN
 */
export const setNewPasswordController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return next(
        new ErrorHandler("New password is required", StatusCodes.BAD_REQUEST)
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    await updateUserPassword(userId, hashed);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  }
);

// ===============================
// GET PROFILE
// ===============================
export const getProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(new ErrorHandler("Unauthorized", StatusCodes.UNAUTHORIZED));
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Profile fetched successfully",
      data: user,
    });
  }
);

// ===============================
// UPDATE PROFILE (name + email)
// ===============================
export const updateProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { name, email } = req.body;

    if (!userId) {
      return next(new ErrorHandler("Unauthorized", StatusCodes.UNAUTHORIZED));
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
      select: { name: true, email: true },
    });

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Profile updated successfully",
      data: updated,
    });
  }
);

// ===============================
// LOGOUT
// ===============================
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response) => {
    res.clearCookie("token");

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Logged out successfully",
    });
  }
);
