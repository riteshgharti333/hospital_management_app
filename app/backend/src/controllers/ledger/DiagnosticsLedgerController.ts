import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createDiagnosticsEntry,
  getAllDiagnosticsEntries,
  getDiagnosticsEntryById,
  getPatientDiagnosticsTotal,
  updateDiagnosticsEntry,
  deleteDiagnosticsEntry,
} from "../../services/ledgerService/diagnosticsLedgerService";
import { diagnosticsLedgerSchema } from "@hospital/schemas";


export const createDiagnosticsRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = diagnosticsLedgerSchema.parse({
      ...req.body,
      date: new Date(req.body.date)
    });

    const entry = await createDiagnosticsEntry(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Diagnostics record created successfully",
      data: entry,
    });
  }
);

export const getAllDiagnosticsRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const filters = {
      patientName: req.query.patientName as string | undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      testName: req.query.testName as string | undefined
    };

    const entries = await getAllDiagnosticsEntries(filters);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Diagnostics records fetched successfully",
      data: entries,
    });
  }
);

export const getDiagnosticsRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const entry = await getDiagnosticsEntryById(id);
    if (!entry) {
      return next(new ErrorHandler("Diagnostics record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Diagnostics record details fetched",
      data: entry,
    });
  }
);

export const getPatientDiagnosticsTotalRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const patientName = req.query.patientName as string;
    if (!patientName) {
      return next(new ErrorHandler("Patient name is required", StatusCodes.BAD_REQUEST));
    }

    const total = await getPatientDiagnosticsTotal(patientName);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Patient diagnostics total calculated",
      data: { patientName, total },
    });
  }
);

export const updateDiagnosticsRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = diagnosticsLedgerSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined
    });

    const updatedEntry = await updateDiagnosticsEntry(id, validatedData);
    if (!updatedEntry) {
      return next(new ErrorHandler("Diagnostics record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Diagnostics record updated successfully",
      data: updatedEntry,
    });
  }
);

export const deleteDiagnosticsRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedEntry = await deleteDiagnosticsEntry(id);
    if (!deletedEntry) {
      return next(new ErrorHandler("Diagnostics record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Diagnostics record deleted successfully",
      data: deletedEntry,
    });
  }
);