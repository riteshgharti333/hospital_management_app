import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createLedgerEntry,
  getLedgerEntryById,
  getPatientBalance,
  updateLedgerEntry,
  deleteLedgerEntry,
  searchPatientLedger,
  filterPatientLedgerService,
  getAllPatientLedgerService,
} from "../../services/ledgerService/patientLedgerService";

import {
  patientLedgerFilterSchema,
  patientLedgerSchema,
} from "@hospital/schemas";
import { validateSearchQuery } from "../../utils/queryValidation";

export const createLedgerEntryRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = patientLedgerSchema.parse({
      ...req.body,
      date: new Date(req.body.date),
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

export const getAllPatientLedgerEntryRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor, limit } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const { data: records, nextCursor } = await getAllPatientLedgerService(
      cursor,
      limit ? Number(limit) : undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Patient ledger records fetched",
      data: records,
      pagination: {
        nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
        limit: limit ? Number(limit) : 50,
      },
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
      return next(
        new ErrorHandler("Ledger entry not found", StatusCodes.NOT_FOUND)
      );
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
      return next(
        new ErrorHandler("Patient name is required", StatusCodes.BAD_REQUEST)
      );
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
      date: req.body.date ? new Date(req.body.date) : undefined,
    });

    const updatedEntry = await updateLedgerEntry(id, validatedData);
    if (!updatedEntry) {
      return next(
        new ErrorHandler("Ledger entry not found", StatusCodes.NOT_FOUND)
      );
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
      return next(
        new ErrorHandler("Ledger entry not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ledger entry deleted successfully",
      data: deletedEntry,
    });
  }
);

export const searchPatientLedgerResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;
    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const results = await searchPatientLedger(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: results,
    });
  }
);

export const filterPatientLedger = catchAsyncError(async (req, res) => {
  const validated = patientLedgerFilterSchema.parse(req.query);

  const { data, nextCursor } = await filterPatientLedgerService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered patient ledger fetched",
    data,
    pagination: {
      nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
      limit: validated.limit,
    },
  });
});




