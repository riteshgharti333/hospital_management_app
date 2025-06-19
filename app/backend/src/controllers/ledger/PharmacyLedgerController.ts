import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createPharmacyLedgerEntry,
  getAllPharmacyLedgerEntries,
  getPharmacyLedgerEntryById,
  getPharmacySummary,
  getCategoryWiseSummary,
  updatePharmacyLedgerEntry,
  deletePharmacyLedgerEntry,
} from "../../services/ledgerService/pharmacyLedgerService";
import { pharmacyLedgerSchema } from "@hospital/schemas";

export const createPharmacyLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = pharmacyLedgerSchema.parse({
      ...req.body,
      date: new Date(req.body.date),
    });

    const entry = await createPharmacyLedgerEntry(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Pharmacy ledger record created successfully",
      data: entry,
    });
  }
);

export const getAllPharmacyLedgerRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const filters = {
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
      medicineName: req.query.medicineName as string | undefined,
      category: req.query.category as string | undefined,
      amountType: req.query.amountType as string | undefined,
    };

    const entries = await getAllPharmacyLedgerEntries(filters);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Pharmacy ledger records fetched successfully",
      data: entries,
    });
  }
);

export const getPharmacyLedgerRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const entry = await getPharmacyLedgerEntryById(id);
    if (!entry) {
      return next(
        new ErrorHandler(
          "Pharmacy ledger record not found",
          StatusCodes.NOT_FOUND
        )
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Pharmacy ledger record details fetched",
      data: entry,
    });
  }
);

export const getPharmacyFinancialSummary = catchAsyncError(
  async (_req: Request, res: Response) => {
    const summary = await getPharmacySummary();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Pharmacy financial summary calculated",
      data: summary,
    });
  }
);

export const getPharmacyCategorySummary = catchAsyncError(
  async (_req: Request, res: Response) => {
    const summary = await getCategoryWiseSummary();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Pharmacy category-wise summary calculated",
      data: summary,
    });
  }
);

export const updatePharmacyLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = pharmacyLedgerSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined,
    });

    const updatedEntry = await updatePharmacyLedgerEntry(id, validatedData);
    if (!updatedEntry) {
      return next(
        new ErrorHandler(
          "Pharmacy ledger record not found",
          StatusCodes.NOT_FOUND
        )
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Pharmacy ledger record updated successfully",
      data: updatedEntry,
    });
  }
);

export const deletePharmacyLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedEntry = await deletePharmacyLedgerEntry(id);
    if (!deletedEntry) {
      return next(
        new ErrorHandler(
          "Pharmacy ledger record not found",
          StatusCodes.NOT_FOUND
        )
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Pharmacy ledger record deleted successfully",
      data: deletedEntry,
    });
  }
);
