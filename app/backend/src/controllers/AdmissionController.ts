import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import { searchAdmissions } from "../services/admissionService";

const prisma = new PrismaClient();

import { admissionSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../utils/queryValidation";

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
export const getAllAdmissions = catchAsyncError(async (req: Request, res: Response) => {
  // 1. Input Validation
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit as string) || 50, 10),
    100
  );
  const skip = (page - 1) * limit;

  // 2. Performance Configuration
  const MAX_RESULTS = 1000;
  const effectiveLimit = Math.min(limit, MAX_RESULTS - skip);

  if (effectiveLimit <= 0) {
    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "No more records available",
      data: {
        metadata: {
          total: 0,
          page,
          pageSize: 0,
          totalPages: 0,
          nextPageToken: null
        },
        admissions: []
      }
    });
  }

  // 3. Full Data Fetch (all fields)
  const [admissions, total] = await Promise.all([
    prisma.admission.findMany({
      skip,
      take: effectiveLimit,
      orderBy: { createdAt: 'desc' }
      // No select/where - returns all fields
    }),
    prisma.admission.count()
  ]);

  // 4. Google-style Pagination
  const remaining = Math.max(0, MAX_RESULTS - (skip + admissions.length));
  const nextPageToken = remaining > 0 && admissions.length === limit
    ? Buffer.from(`page=${page + 1}&limit=${limit}`).toString('base64')
    : null;

  // 5. Full Response with All Fields
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Admissions fetched successfully",
    data: {
      metadata: {
        total: Math.min(total, MAX_RESULTS),
        page,
        pageSize: admissions.length,
        totalPages: Math.ceil(Math.min(total, MAX_RESULTS) / limit),
        nextPageToken
      },
      admissions // Contains all admission fields
    }
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
