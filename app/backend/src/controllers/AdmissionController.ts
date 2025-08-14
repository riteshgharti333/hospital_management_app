import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  getAllAdmissionsService,
  highPerfFilterAdmissions,
  searchAdmissions,
} from "../services/admissionService";

const prisma = new PrismaClient();

import { admissionSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../utils/queryValidation";
import { z } from "zod";

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
        limit: limit ? Number(limit) : 100,
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

const filterSchema = z.object({
  dateFrom: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .optional(),
  dateTo: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .optional(),
  bloodGroup: z.string()
    .transform(val => {
      // Trim whitespace and standardize format
      const trimmed = val.trim().toUpperCase();
      if (trimmed === 'O') return 'O+'; // Default to O+ if just O
      if (trimmed === 'O ') return 'O+'; // Handle case with trailing space
      return trimmed;
    })
    .refine(val => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(val), {
      message: "Invalid blood group. Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-"
    })
    .optional(),
  sex: z.enum(["Male", "Female", "Other"])
    .optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(200).optional().default(100)
});


export const filterAdmissions = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clean and standardize query parameters
      const cleanedQuery = {
        ...req.query,
        bloodGroup: req.query.bloodGroup?.toString().trim().toUpperCase(),
        limit: req.query.limit ? Number(req.query.limit) : undefined
      };

      // Validate input
      const parsed = filterSchema.safeParse(cleanedQuery);
      
      if (!parsed.success) {
        const errors = parsed.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return next(new ErrorHandler(
          `Validation failed: ${JSON.stringify(errors)}`,
          StatusCodes.BAD_REQUEST
        ));
      }

      const validated = parsed.data;

      // Validate date range
      if (validated.dateFrom && validated.dateTo) {
        const fromDate = new Date(validated.dateFrom);
        const toDate = new Date(validated.dateTo);
        if (fromDate > toDate) {
          return next(new ErrorHandler(
            "End date must be after start date", 
            StatusCodes.BAD_REQUEST
          ));
        }
      }

      // Call service
      const result = await highPerfFilterAdmissions(
        prisma,
        {
          dateFrom: validated.dateFrom ? new Date(validated.dateFrom) : undefined,
          dateTo: validated.dateTo ? new Date(validated.dateTo) : undefined,
          bloodGroup: validated.bloodGroup,
          sex: validated.sex
        },
        {
          cursor: validated.cursor,
          limit: validated.limit
        }
      );

      // Send response
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Admissions filtered successfully",
        pagination: {
          nextCursor: result.nextCursor !== null ? String(result.nextCursor) : undefined,
          limit: validated.limit
        },
        data: result.data,
      
      });

    } catch (error) {
      console.error("Filter error:", error);
      return next(new ErrorHandler(
        "Failed to filter admissions",
        StatusCodes.INTERNAL_ERROR
      ));
    }
  }
);

