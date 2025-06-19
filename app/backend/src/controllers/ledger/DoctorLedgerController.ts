import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createDoctorLedgerEntry,
  getAllDoctorLedgerEntries,
  getDoctorLedgerEntryById,
  getDoctorBalance,
  updateDoctorLedgerEntry,
  deleteDoctorLedgerEntry,
} from "../../services/ledgerService/doctorLedgerService";

import { doctorLedgerSchema } from "@hospital/schemas";

export const createDoctorLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = doctorLedgerSchema.parse({
      ...req.body,
      date: new Date(req.body.date)
    });

    const entry = await createDoctorLedgerEntry(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Doctor ledger entry created successfully",
      data: entry,
    });
  }
);

export const getAllDoctorLedgerRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const filters = {
      doctorName: req.query.doctorName as string | undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      amountType: req.query.amountType as string | undefined
    };

    const entries = await getAllDoctorLedgerEntries(filters);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor ledger entries fetched successfully",
      data: entries,
    });
  }
);

export const getDoctorLedgerRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const entry = await getDoctorLedgerEntryById(id);
    if (!entry) {
      return next(new ErrorHandler("Doctor ledger entry not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor ledger entry details fetched",
      data: entry,
    });
  }
);

export const getDoctorBalanceRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctorName = req.query.doctorName as string;
    if (!doctorName) {
      return next(new ErrorHandler("Doctor name is required", StatusCodes.BAD_REQUEST));
    }

    const balance = await getDoctorBalance(doctorName);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor balance calculated",
      data: { doctorName, balance },
    });
  }
);

export const updateDoctorLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = doctorLedgerSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined
    });

    const updatedEntry = await updateDoctorLedgerEntry(id, validatedData);
    if (!updatedEntry) {
      return next(new ErrorHandler("Doctor ledger entry not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor ledger entry updated successfully",
      data: updatedEntry,
    });
  }
);

export const deleteDoctorLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedEntry = await deleteDoctorLedgerEntry(id);
    if (!deletedEntry) {
      return next(new ErrorHandler("Doctor ledger entry not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor ledger entry deleted successfully",
      data: deletedEntry,
    });
  }
);