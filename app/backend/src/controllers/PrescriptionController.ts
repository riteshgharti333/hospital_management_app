import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  updatePrescription,
  deletePrescription,
} from "../services/prescriptionService";

import { prescriptionSchema } from "@hospital/schemas";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUploader";
import { validateSearchQuery } from "../utils/queryValidation";
import { searchPrescriptions } from "../utils/prescriptionSearchCache";

export const createPrescriptionRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let uploadedUrl: string | undefined;

    // ✅ Upload file if exists
    if (req.file) {
      uploadedUrl = await uploadToCloudinary(req.file.buffer);
    }

    const validated = prescriptionSchema.parse({
      ...req.body,
      prescriptionDate: new Date(req.body.prescriptionDate),
      doctorId: Number(req.body.doctorId),
      patientId: Number(req.body.patientId),
      prescriptionDoc: uploadedUrl,
    });

    const prescription = await createPrescription(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Prescription created successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPrescriptionRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor, limit } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const { data: prescription, nextCursor } = await getAllPrescriptions(
      cursor,
      limit ? Number(limit) : undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription records fetched",
      data: prescription,
      pagination: {
        nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
        limit: limit ? Number(limit) : 50,
      },
    });
  }
);

export const getPrescriptionRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const prescription = await getPrescriptionById(id);
    if (!prescription) {
      return next(
        new ErrorHandler("Prescription not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription details fetched",
      data: prescription,
    });
  }
);

export const updatePrescriptionRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const existing = await getPrescriptionById(id);
    if (!existing) {
      return next(
        new ErrorHandler("Prescription not found", StatusCodes.NOT_FOUND)
      );
    }

    let uploadedUrl: string | undefined;

    // ✅ Delete old file and upload new if file exists
    if (req.file) {
      if (existing.prescriptionDoc) {
        await deleteFromCloudinary(existing.prescriptionDoc);
      }

      uploadedUrl = await uploadToCloudinary(req.file.buffer);
    }

    const partialSchema = prescriptionSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      prescriptionDate: req.body.prescriptionDate
        ? new Date(req.body.prescriptionDate)
        : undefined,
      doctorId: req.body.doctorId ? Number(req.body.doctorId) : undefined,
      patientId: req.body.patientId ? Number(req.body.patientId) : undefined,
      prescriptionDoc: uploadedUrl ?? req.body.prescriptionDoc ?? undefined,
    });

    const updatedPrescription = await updatePrescription(id, validatedData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription updated successfully",
      data: updatedPrescription,
    });
  }
);

export const deletePrescriptionRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const existing = await getPrescriptionById(id);
    if (!existing) {
      return next(
        new ErrorHandler("Prescription not found", StatusCodes.NOT_FOUND)
      );
    }

    if (existing.prescriptionDoc) {
      await deleteFromCloudinary(existing.prescriptionDoc);
    }

    const deletedPrescription = await deletePrescription(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription deleted successfully",
    });
  }
);

export const searchPrescriptionsResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const prescriptions = await searchPrescriptions(searchTerm);

    res.status(200).json({
      success: true,
      message: "Prescriptions fetched successfully",
      data: prescriptions,
    });
  }
);
