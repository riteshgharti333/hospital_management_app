import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  searchPrescription,
  filterPrescriptionsService,
  getPrescriptionsByAdmission,
} from "../services/prescriptionService";
import { prescriptionSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../utils/queryValidation";
import { PAGINATION_CONFIG } from "../lib/paginationConfig";
import { uploadFileToS3 } from "../aws/s3.service";


export const createPrescriptionRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Parse medicines if string
    if (req.body.medicines && typeof req.body.medicines === 'string') {
      req.body.medicines = JSON.parse(req.body.medicines);
    }
    
    // Clean and trim string fields
    if (req.body.status) {
      req.body.status = req.body.status.trim();
    }
    
    if (req.body.notes) {
      req.body.notes = req.body.notes.trim();
    }

    // Remove empty fields
    if (req.body.prescriptionDate === '') {
      delete req.body.prescriptionDate;
    }

    // Ensure admissionId is a valid number
    if (!req.body.admissionId || req.body.admissionId === '') {
      return next(new ErrorHandler("Admission ID is required", StatusCodes.BAD_REQUEST));
    }
    
    const admissionId = Number(req.body.admissionId);
    if (isNaN(admissionId)) {
      return next(new ErrorHandler("Admission ID must be a valid number", StatusCodes.BAD_REQUEST));
    }
    req.body.admissionId = admissionId;

    // Handle optional file upload with prescriptionDoc field
    if (req.file) {
      const { url } = await uploadFileToS3(req.file);
      req.body.prescriptionDoc = url;
    }

    const validated = prescriptionSchema.parse(req.body);
    const prescription = await createPrescription(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Prescription created successfully",
      data: prescription,
    });
  },
);

export const getAllPrescriptionRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor } = req.query as { cursor?: string };

    const result = await getAllPrescriptions(cursor);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription records fetched",
      data: result.data,
      pagination: {
        nextCursor: result.pagination.nextCursor || undefined,
        hasMore: result.pagination.hasMore,
      },
    });
  },
);

export const getPrescriptionRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const prescription = await getPrescriptionById(id);
    if (!prescription) {
      return next(new ErrorHandler("Prescription not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription details fetched",
      data: prescription,
    });
  },
);

// In PrescriptionController.ts - Add this new endpoint

export const uploadPrescriptionDoc = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(new ErrorHandler("No file uploaded", StatusCodes.BAD_REQUEST));
    }

    const { url } = await uploadFileToS3(req.file);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "File uploaded successfully",
      data: { url },
    });
  },
);

export const updatePrescriptionRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    
    // Parse medicines if string
    if (req.body.medicines && typeof req.body.medicines === 'string') {
      req.body.medicines = JSON.parse(req.body.medicines);
    }
    
    // Convert admissionId to number
    if (req.body.admissionId) {
      req.body.admissionId = Number(req.body.admissionId);
    }

    // Handle optional file upload
    if (req.file) {
      const { url } = await uploadFileToS3(req.file);
      req.body.prescriptionDoc = url;
    }

    const partialSchema = prescriptionSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedPrescription = await updatePrescription(id, validatedData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription updated successfully",
      data: updatedPrescription,
    });
  },
);

export const deletePrescriptionRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedPrescription = await deletePrescription(id);
    if (!deletedPrescription) {
      return next(new ErrorHandler("Prescription not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription deleted successfully",
      data: deletedPrescription,
    });
  },
);

export const searchPrescriptionResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const prescriptions = await searchPrescription(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: prescriptions,
    });
  },
);

export const filterPrescriptions = catchAsyncError(async (req, res) => {
  const filterSchema = z.object({
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
    admissionId: z.coerce.number().optional(),
    cursor: z.string().optional(),
    limit: z.coerce.number().optional(),
  });

  const validated = filterSchema.parse(req.query);

  const { data, nextCursor, hasMore } = await filterPrescriptionsService({
    ...validated,
    fromDate: validated.fromDate ? new Date(validated.fromDate) : undefined,
    toDate: validated.toDate ? new Date(validated.toDate) : undefined,
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered prescriptions fetched",
    data,
    pagination: {
      nextCursor: nextCursor || undefined,
      limit: validated.limit ?? PAGINATION_CONFIG.DEFAULT_LIMIT,
      hasMore,
    },
  });
});

export const getPrescriptionsByAdmissionId = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const admissionId = Number(req.params.admissionId);
    if (isNaN(admissionId)) {
      return next(new ErrorHandler("Invalid Admission ID", StatusCodes.BAD_REQUEST));
    }

    const prescriptions = await getPrescriptionsByAdmission(admissionId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission prescriptions fetched successfully",
      data: prescriptions,
    });
  },
);