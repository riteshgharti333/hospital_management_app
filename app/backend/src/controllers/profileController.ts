import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";

const prisma = new PrismaClient();

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// CREATE
export const createProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = profileSchema.parse(req.body);
    const profile = await prisma.profile.create({ data: validated });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Profile created successfully",
      data: profile,
    });
  }
);

// GET ALL
export const getAllProfiles = catchAsyncError(async (_req, res) => {
  const profiles = await prisma.profile.findMany();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All profiles fetched",
    data: profiles,
  });
});

// GET SINGLE BY ID
export const getProfileById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile)
      return next(new ErrorHandler("Profile not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Profile details fetched",
      data: profile,
    });
  }
);

// UPDATE
export const updateProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    // Allow partial update
    const partialSchema = profileSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedProfile = await prisma.profile.update({
      where: { id },
      data: validatedData,
    });

    if (!updatedProfile)
      return next(new ErrorHandler("Profile not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  }
);

// DELETE
export const deleteProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const deletedProfile = await prisma.profile.delete({ where: { id } });
    if (!deletedProfile)
      return next(new ErrorHandler("Profile not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Profile deleted successfully",
      data: deletedProfile,
    });
  }
);
