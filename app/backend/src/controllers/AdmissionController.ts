import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  filterAdmissionsService,
  getAllAdmissionsService,
  searchAdmissions,
} from "../services/admissionService";

const prisma = new PrismaClient();

import { admissionFilterSchema, admissionSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../utils/queryValidation";

// CREATE

export const createAdmission = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = admissionSchema.parse(req.body);

      // Generate numbers BEFORE creating admission
      const year = new Date().getFullYear();
      const month = (new Date().getMonth() + 1).toString().padStart(2, "0");

      // Get the next available ID
      const lastAdmission = await prisma.admission.findFirst({
        orderBy: { id: "desc" },
      });

      const nextId = (lastAdmission?.id || 0) + 1;

      const gsRsRegNo = `GS${year}/${nextId.toString().padStart(4, "0")}`;
      const urnNo = `URN${year}${month}${nextId.toString().padStart(3, "0")}`;

      // Create admission with all data at once
      const admission = await prisma.admission.create({
        data: {
          ...validated,
          gsRsRegNo,
          urnNo,
        },
      });

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Admission created successfully",
        data: admission,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET ALL

export const getAllAdmissions = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor, limit } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const { data: admission, nextCursor } = await getAllAdmissionsService(
      cursor,
      limit ? Number(limit) : undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission records fetched",
      data: admission,
      pagination: {
        nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
        limit: limit ? Number(limit) : 50,
      },
    });
  }
);

// GET SINGLE BY ID
export const getAdmissionById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const admission = await prisma.admission.findUnique({ where: { id } });
    if (!admission)
      return next(
        new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND)
      );

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
      return next(
        new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND)
      );

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
      return next(
        new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND)
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission deleted successfully",
      data: deletedAdmission,
    });
  }
);

//////////// SEARCH ADMISSIONS

export const searchAdmissionsResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;
    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const admissions = await searchAdmissions(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: admissions,
    });
  }
);

/////////// 

export const filterAdmissions = catchAsyncError(async (req, res) => {
  // Validate query params
  const validated = admissionFilterSchema.parse(req.query);

  // Get filtered results   
  const { data, nextCursor } = await filterAdmissionsService(validated);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered admissions fetched",
    data,
    pagination: {
      nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
      limit: validated.limit || 50,
    },
  });
});
