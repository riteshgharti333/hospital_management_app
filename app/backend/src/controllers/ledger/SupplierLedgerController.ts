import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createSupplierLedgerEntry,
  getAllSupplierLedgerEntries,
  getSupplierLedgerEntryById,
  getSupplierOutstanding,
  getSupplierSummary,
  updateSupplierLedgerEntry,
  deleteSupplierLedgerEntry,
} from "../../services/ledgerService/supplierLedgerService";

import { supplierLedgerSchema } from "@hospital/schemas";

export const createSupplierLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = supplierLedgerSchema.parse({
      ...req.body,
      date: new Date(req.body.date)
    });

    const entry = await createSupplierLedgerEntry(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Supplier ledger record created successfully",
      data: entry,
    });
  }
);

export const getAllSupplierLedgerRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const filters = {
      supplierName: req.query.supplierName as string | undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      invoiceNo: req.query.invoiceNo as string | undefined,
      amountType: req.query.amountType as string | undefined
    };

    const entries = await getAllSupplierLedgerEntries(filters);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Supplier ledger records fetched successfully",
      data: entries,
    });
  }
);

export const getSupplierLedgerRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const entry = await getSupplierLedgerEntryById(id);
    if (!entry) {
      return next(new ErrorHandler("Supplier ledger record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Supplier ledger record details fetched",
      data: entry,
    });
  }
);

export const getSupplierOutstandingBalance = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const supplierName = req.query.supplierName as string;
    if (!supplierName) {
      return next(new ErrorHandler("Supplier name is required", StatusCodes.BAD_REQUEST));
    }

    const balance = await getSupplierOutstanding(supplierName);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Supplier outstanding balance calculated",
      data: { supplierName, balance },
    });
  }
);

export const getSupplierSummaryReport = catchAsyncError(
  async (_req: Request, res: Response) => {
    const summary = await getSupplierSummary();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Supplier summary report generated",
      data: summary,
    });
  }
);

export const updateSupplierLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = supplierLedgerSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined
    });

    const updatedEntry = await updateSupplierLedgerEntry(id, validatedData);
    if (!updatedEntry) {
      return next(new ErrorHandler("Supplier ledger record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Supplier ledger record updated successfully",
      data: updatedEntry,
    });
  }
);

export const deleteSupplierLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedEntry = await deleteSupplierLedgerEntry(id);
    if (!deletedEntry) {
      return next(new ErrorHandler("Supplier ledger record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Supplier ledger record deleted successfully",
      data: deletedEntry,
    });
  }
);