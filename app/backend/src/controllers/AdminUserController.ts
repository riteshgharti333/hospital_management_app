import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { StatusCodes } from "../constants/statusCodes";
import { prisma } from "../lib/prisma";
import {
  createUserLogin,
  deleteUserByRegId,
  getUserByRegId,
  getUsersAggregated,
  regenerateTempPassword,
} from "../services/userService";
import { sendResponse } from "../utils/sendResponse";

// Reusable Type for allowed staff roles
type StaffRole = "DOCTOR" | "NURSE";

// Shared shape for Doctor and Nurse fields we use
interface StaffBase {
  fullName: string;
  email: string;
  registrationNo: string;
}

// CREATE ACCESS (Doctor or Nurse)
export const createStaffAccess = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { regId } = req.body;

    if (!regId) {
      return next(
        new ErrorHandler("Registration ID required", StatusCodes.BAD_REQUEST)
      );
    }

    let staff: StaffBase | null = null;
    let role: StaffRole;

    // Detect staff type
    if (regId.startsWith("DOC-")) {
      staff = await prisma.doctor.findUnique({
        where: { registrationNo: regId },
        select: { fullName: true, email: true, registrationNo: true },
      });
      role = "DOCTOR";
    } else if (regId.startsWith("NUR-")) {
      staff = await prisma.nurse.findUnique({
        where: { registrationNo: regId },
        select: { fullName: true, email: true, registrationNo: true },
      });
      role = "NURSE";
    } else {
      return next(
        new ErrorHandler("Invalid registration format", StatusCodes.BAD_REQUEST)
      );
    }

    if (!staff) {
      return next(new ErrorHandler("Staff not found", StatusCodes.NOT_FOUND));
    }

    const existing = await getUserByRegId(regId);
    if (existing) {
      return next(
        new ErrorHandler(
          "Login already created for this user",
          StatusCodes.CONFLICT
        )
      );
    }

    // 🔐 Generate temp password
    const tempPassword =
      (role === "DOCTOR" ? "Doc@" : "Nur@") +
      Math.floor(100000 + Math.random() * 900000);

    const hashed = await bcrypt.hash(tempPassword, 12);

    // ✅ Store hashed password + tempPasswordHash
    const newUser = await prisma.user.create({
      data: {
        regId,
        name: staff.fullName,
        email: staff.email,
        role,
        password: hashed,
        mustChangePassword: true,
        isActive: false,
      },
    });

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: `${role} access created successfully`,
      data: {
        regId: newUser.regId,
        name: newUser.name,
        email: newUser.email,
        role,
        tempPassword,
        status: "DISABLED",
      },
    });
  }
);

// TOGGLE ACCESS (doctor or nurse)
export const toggleStaffAccess = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { regId, action } = req.body;

    if (!regId) {
      return next(new ErrorHandler("regId required", StatusCodes.BAD_REQUEST));
    }

    const user = await prisma.user.findUnique({ where: { regId } });
    if (!user) {
      return next(
        new ErrorHandler("User login not found", StatusCodes.NOT_FOUND)
      );
    }

    if (!["ENABLE", "DISABLE"].includes(action)) {
      return next(
        new ErrorHandler(
          "Action must be ENABLE or DISABLE",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const updated = await prisma.user.update({
      where: { regId },
      data: { isActive: action === "ENABLE" },
    });

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Access ${
        action === "ENABLE" ? "enabled" : "disabled"
      } successfully`,
      data: {
        regId: updated.regId,
        name: updated.name,
        role: updated.role,
        status: updated.isActive ? "ACTIVE" : "DISABLED",
      },
    });
  }
);

export const getAllUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const rawRole = (req.query.role as string) || undefined;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.max(1, Number(req.query.limit || 25));

    // ❌ ADMIN removed
    const allowedRoles = ["DOCTOR", "NURSE"];
    let role: "DOCTOR" | "NURSE" | undefined = undefined;

    if (rawRole) {
      const upperRole = rawRole.toUpperCase();

      if (!allowedRoles.includes(upperRole)) {
        return next(
          new ErrorHandler("Invalid role query", StatusCodes.BAD_REQUEST)
        );
      }

      role = upperRole as "DOCTOR" | "NURSE";
    }

    const offset = (page - 1) * limit;

    const data = await getUsersAggregated({
      role,
      skip: offset,
      take: limit,
    });

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Users fetched successfully",
      data: {
        page,
        limit,
        ...data,
      },
    });
  }
);

export const regenerateStaffTempPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { regId } = req.body;

    if (!regId) {
      return next(
        new ErrorHandler("regId is required", StatusCodes.BAD_REQUEST)
      );
    }

    const result = await regenerateTempPassword(regId);

    if (!result) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Temporary password regenerated successfully",
      data: {
        regId: result.regId,
        tempPassword: result.tempPassword,
      },
    });
  }
);

export const deleteUserRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { regId } = req.params;

    if (!regId) {
      return next(
        new ErrorHandler("regId is required", StatusCodes.BAD_REQUEST)
      );
    }

    try {
      const deletedUser = await deleteUserByRegId(regId);

      if (!deletedUser) {
        return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
      }

      return sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User deleted successfully",
        data: deletedUser,
      });
    } catch (error: any) {
      if (error.message === "ADMIN_DELETE_NOT_ALLOWED") {
        return next(
          new ErrorHandler(
            "Admin users cannot be deleted",
            StatusCodes.FORBIDDEN
          )
        );
      }

      return next(
        new ErrorHandler("Failed to delete user", StatusCodes.INTERNAL_ERROR)
      );
    }
  }
);
