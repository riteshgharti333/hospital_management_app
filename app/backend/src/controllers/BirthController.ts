import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createBirth,
  getAllBirths,
  getBirthById,
  updateBirth,
  deleteBirth,
} from "../services/birthService";
import { birthSchema } from "@hospital/schemas";


export const createBirthRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
     try {
       const validated = birthSchema.parse(req.body);
    const birth = await createBirth(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Birth record created successfully",
      data: birth,
    });
     } catch (error) {
      console.log(error)
     }
  }
);

export const getAllBirthRecords = catchAsyncError(async (_req, res) => {
  const births = await getAllBirths();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All birth records fetched",
    data: births,
  });
});

export const getBirthRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const birth = await getBirthById(id);
    if (!birth)
      return next(new ErrorHandler("Birth record not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Birth record details fetched",
      data: birth,
    });
  }
);

export const updateBirthRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const partialSchema = birthSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedBirth = await updateBirth(id, validatedData);
    if (!updatedBirth)
      return next(new ErrorHandler("Birth record not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Birth record updated successfully",
      data: updatedBirth,
    });
  }
);

export const deleteBirthRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const deletedBirth = await deleteBirth(id);
    if (!deletedBirth)
      return next(new ErrorHandler("Birth record not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Birth record deleted successfully",
      data: deletedBirth,
    });
  }
);