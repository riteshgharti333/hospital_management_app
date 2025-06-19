import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";

const prisma = new PrismaClient();

import { admissionSchema } from "@hospital/schemas";


// CREATE
export const createAdmission = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = admissionSchema.parse(req.body);
    const admission = await prisma.admission.create({ data: validated });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Admission created successfully",
      data: admission,
    });
  }
);

// GET ALL
export const getAllAdmissions = catchAsyncError(async (_req, res) => {
  const admissions = await prisma.admission.findMany({ 
    orderBy: { createdAt: 'desc' } 
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All admissions fetched",
    data: admissions,
  });
});

// GET SINGLE BY ID
export const getAdmissionById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const admission = await prisma.admission.findUnique({ where: { id } });
    if (!admission)
      return next(new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission details fetched",
      data: admission,
    });
  }
);

// UPDATE
export const updateAdmission = catchAsyncError(

  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    // Allow partial update
    const partialSchema = admissionSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedAdmission = await prisma.admission.update({
      where: { id },
      data: validatedData,
    });

    if (!updatedAdmission)
      return next(new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission updated successfully",
      data: updatedAdmission,
    });
  }
);

// DELETE
export const deleteAdmission = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const deletedAdmission = await prisma.admission.delete({ where: { id } });
    if (!deletedAdmission)
      return next(new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission deleted successfully",
      data: deletedAdmission,
    });
  }
);