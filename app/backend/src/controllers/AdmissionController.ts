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
  // 1. Input Validation with schema validation (consider using Zod/Joi)
  const DEFAULT_LIMIT = 50;
  const MAX_LIMIT = 100;
  const MAX_RESULTS = 1000;
  
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit as string) || DEFAULT_LIMIT, 10),
    MAX_LIMIT
  );
  
  // 2. Early exit for invalid pagination
  const skip = (page - 1) * limit;
  if (skip >= MAX_RESULTS) {
    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "No more records available",
      data: emptyPaginationResponse(page)
    });
  }

  // 3. Parallel execution with optimized queries
  const [admissions, total] = await Promise.all([
    prisma.admission.findMany({
      skip,
      take: Math.min(limit, MAX_RESULTS - skip),
      orderBy: { createdAt: 'desc' },
      // Consider adding cursor-based pagination for better performance on large datasets
      select: { 
        id: true,
        // Explicitly list only needed fields for better performance
        // Add other fields you actually need
      }
    }),
    prisma.admission.count({
      where: {
        // Add any relevant filters to match your findMany if needed
      }
    })
  ]);

  // 4. Calculate pagination metadata
  const cappedTotal = Math.min(total, MAX_RESULTS);
  const hasMore = skip + admissions.length < cappedTotal;
  
  // 5. Response
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Admissions fetched successfully",
    data: {
      metadata: {
        total: cappedTotal,
        page,
        pageSize: admissions.length,
        totalPages: Math.ceil(cappedTotal / limit),
        nextPageToken: hasMore 
          ? generateNextPageToken(page + 1, limit)
          : null
      },
      admissions
    }
  });
});

// Helper functions for better readability and reusability
function emptyPaginationResponse(page: number) {
  return {
    metadata: {
      total: 0,
      page,
      pageSize: 0,
      totalPages: 0,
      nextPageToken: null
    },
    admissions: []
  };
}

function generateNextPageToken(page: number, limit: number) {
  return Buffer.from(`page=${page}&limit=${limit}`).toString('base64');
}

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
