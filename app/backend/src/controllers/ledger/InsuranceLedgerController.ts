import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createInsuranceLedgerEntry,
  getAllInsuranceLedgerEntries,
  getInsuranceLedgerEntryById,
  getInsuranceSummary,
  updateInsuranceLedgerEntry,
  deleteInsuranceLedgerEntry,
} from "../../services/ledgerService/insuranceLedgerService";

import { insuranceLedgerSchema } from "@hospital/schemas";

export const createInsuranceLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = insuranceLedgerSchema.parse({
      ...req.body,
      claimDate: new Date(req.body.claimDate),
      approvalDate: req.body.approvalDate ? new Date(req.body.approvalDate) : undefined,
      settlementDate: req.body.settlementDate ? new Date(req.body.settlementDate) : undefined
    });

    const entry = await createInsuranceLedgerEntry(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Insurance ledger record created successfully",
      data: entry,
    });
  }
);

export const getAllInsuranceLedgerRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const filters = {
      patientName: req.query.patientName as string | undefined,
      tpaInsuranceCompany: req.query.tpaInsuranceCompany as string | undefined,
      status: req.query.status as string | undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
    };

    const entries = await getAllInsuranceLedgerEntries(filters);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Insurance ledger records fetched successfully",
      data: entries,
    });
  }
);

export const getInsuranceLedgerRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const entry = await getInsuranceLedgerEntryById(id);
    if (!entry) {
      return next(new ErrorHandler("Insurance ledger record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Insurance ledger record details fetched",
      data: entry,
    });
  }
);

export const getInsuranceSummaryReport = catchAsyncError(
  async (_req: Request, res: Response) => {
    const report = await getInsuranceSummary();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Insurance summary report generated",
      data: report,
    });
  }
);

export const updateInsuranceLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = insuranceLedgerSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      claimDate: req.body.claimDate ? new Date(req.body.claimDate) : undefined,
      approvalDate: req.body.approvalDate ? new Date(req.body.approvalDate) : undefined,
      settlementDate: req.body.settlementDate ? new Date(req.body.settlementDate) : undefined
    });

    const updatedEntry = await updateInsuranceLedgerEntry(id, validatedData);
    if (!updatedEntry) {
      return next(new ErrorHandler("Insurance ledger record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Insurance ledger record updated successfully",
      data: updatedEntry,
    });
  }
);

export const deleteInsuranceLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedEntry = await deleteInsuranceLedgerEntry(id);
    if (!deletedEntry) {
      return next(new ErrorHandler("Insurance ledger record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Insurance ledger record deleted successfully",
      data: deletedEntry,
    });
  }
);