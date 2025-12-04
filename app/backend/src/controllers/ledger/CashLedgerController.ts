import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createCashLedgerEntry,
  getCashLedgerEntryById,
  getCashBalance,
  updateCashLedgerEntry,
  deleteCashLedgerEntry,
  searchCashLedger,
  filterCashLedgerService,
  getAllCashLedgerService,
} from "../../services/ledgerService/cashLedgerService";

import { cashLedgerFilterSchema, cashLedgerSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../../utils/queryValidation";

export const createCashLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = cashLedgerSchema.parse({
      ...req.body,
      date: new Date(req.body.date),
    });

    const entry = await createCashLedgerEntry(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Cash ledger entry created successfully",
      data: entry,
    });
  }
);

export const getAllCashLedgerRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor, limit } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const { data: records, nextCursor } = await getAllCashLedgerService(
      cursor,
      limit ? Number(limit) : undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cash ledger records fetched",
      data: records,
      pagination: {
        nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
        limit: limit ? Number(limit) : 50,
      },
    });
  }
);


export const getCashLedgerRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const entry = await getCashLedgerEntryById(id);
    if (!entry) {
      return next(
        new ErrorHandler("Cash ledger entry not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cash ledger entry details fetched",
      data: entry,
    });
  }
);

export const getCashBalanceRecord = catchAsyncError(
  async (_req: Request, res: Response) => {
    const balance = await getCashBalance();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Current cash balance calculated",
      data: { balance },
    });
  }
);

export const updateCashLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = cashLedgerSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined,
    });

    const updatedEntry = await updateCashLedgerEntry(id, validatedData);
    if (!updatedEntry) {
      return next(
        new ErrorHandler("Cash ledger entry not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cash ledger entry updated successfully",
      data: updatedEntry,
    });
  }
);

export const deleteCashLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedEntry = await deleteCashLedgerEntry(id);
    if (!deletedEntry) {
      return next(
        new ErrorHandler("Cash ledger entry not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cash ledger entry deleted successfully",
      data: deletedEntry,
    });
  }
);

export const searchCashLedgerResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const results = await searchCashLedger(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cash ledger search results fetched",
      data: results,
    });
  }
);


export const filterCashLedger = catchAsyncError(async (req, res) => {
  const validated = cashLedgerFilterSchema.parse(req.query);

  const { data, nextCursor } = await filterCashLedgerService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered cash ledger fetched",
    data,
    pagination: {
      nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
      limit: validated.limit,
    },
  });
});
