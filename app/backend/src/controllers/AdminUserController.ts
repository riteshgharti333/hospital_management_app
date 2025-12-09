import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { StatusCodes } from "../constants/statusCodes";

import { prisma } from "../lib/prisma";
import { createDoctorUser, getUserByRegId } from "../services/userService";
import { sendResponse } from "../utils/sendResponse";

export const giveDoctorAccess = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { regId } = req.body; // Example: DOC-101

    if (!regId || !regId.startsWith("DOC-")) {
      return next(
        new ErrorHandler("Invalid doctor registration number", StatusCodes.BAD_REQUEST)
      );
    }

    // Step 1: Look up doctor in Doctor table
    const doctor = await prisma.doctor.findUnique({
      where: { registrationNo: regId },
    });

    if (!doctor) {
      return next(new ErrorHandler("Doctor not found", StatusCodes.NOT_FOUND));
    }

    // Step 2: Check if doctor already has login access
    const existingUser = await getUserByRegId(regId);
    if (existingUser) {
      return next(
        new ErrorHandler("Login already created for this doctor", StatusCodes.CONFLICT)
      );
    }

    // Step 3: Generate temporary password
    const tempPassword = "Doc@" + Math.floor(100000 + Math.random() * 900000);
    const hashed = await bcrypt.hash(tempPassword, 12);

    // Step 4: Create User Login
    const newUser = await createDoctorUser({
      regId,
      name: doctor.fullName,
      email: doctor.email,
      role: "DOCTOR",
      password: hashed,
    });

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Doctor login access created successfully",
      data: {
        regId: newUser.regId,
        name: newUser.name,
        email: newUser.email,
        tempPassword,
      },
    });
  }
);
