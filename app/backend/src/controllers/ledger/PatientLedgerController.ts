import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createLedgerEntry,
  getAllLedgerEntries,
  getLedgerEntryById,
  getPatientBalance,
  updateLedgerEntry,
  deleteLedgerEntry,
} from "../../services/ledgerService/patientLedgerService";

import { patientLedgerSchema } from "@hospital/schemas";

export const createLedgerEntryRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = patientLedgerSchema.parse({
      ...req.body,
      date: new Date(req.body.date)
    });

    const entry = await createLedgerEntry(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Patient ledger entry created successfully",
      data: entry,
    });
  }
);

export const getAllLedgerEntryRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const filters = {
      patientName: req.query.patientName as string | undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      amountType: req.query.amountType as string | undefined
    };

    const entries = await getAllLedgerEntries(filters);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ledger entries fetched successfully",
      data: entries,
    });
  }
);

export const getLedgerEntryRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const entry = await getLedgerEntryById(id);
    if (!entry) {
      return next(new ErrorHandler("Ledger entry not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ledger entry details fetched",
      data: entry,
    });
  }
);

export const getPatientBalanceRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const patientName = req.query.patientName as string;
    if (!patientName) {
      return next(new ErrorHandler("Patient name is required", StatusCodes.BAD_REQUEST));
    }

    const balance = await getPatientBalance(patientName);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Patient balance calculated",
      data: { patientName, balance },
    });
  }
);

export const updateLedgerEntryRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = patientLedgerSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined
    });

    const updatedEntry = await updateLedgerEntry(id, validatedData);
    if (!updatedEntry) {
      return next(new ErrorHandler("Ledger entry not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ledger entry updated successfully",
      data: updatedEntry,
    });
  }
);

export const deleteLedgerEntryRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedEntry = await deleteLedgerEntry(id);
    if (!deletedEntry) {
      return next(new ErrorHandler("Ledger entry not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ledger entry deleted successfully",
      data: deletedEntry,
    });
  }
);