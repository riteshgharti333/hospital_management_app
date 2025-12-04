import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createBankLedgerEntry,
  getBankLedgerEntryById,
  getBankBalance,
  updateBankLedgerEntry,
  deleteBankLedgerEntry,
  searchBankLedger,
  filterBankLedgerService,
  getAllBankLedgerService,
} from "../../services/ledgerService/bankLedgerService";

import { bankLedgerFilterSchema, bankLedgerSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../../utils/queryValidation";

export const createBankLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = bankLedgerSchema.parse({
      ...req.body,
      date: new Date(req.body.date),
    });

    const entry = await createBankLedgerEntry(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Bank ledger entry created successfully",
      data: entry,
    });
  }
);

export const getAllBankLedgerRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor, limit } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const { data: records, nextCursor } = await getAllBankLedgerService(
      cursor,
      limit ? Number(limit) : undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bank ledger records fetched",
      data: records,
      pagination: {
        nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
        limit: limit ? Number(limit) : 50,
      },
    });
  }
);

export const getBankLedgerRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const entry = await getBankLedgerEntryById(id);
    if (!entry) {
      return next(
        new ErrorHandler("Bank ledger entry not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bank ledger entry details fetched",
      data: entry,
    });
  }
);

export const getBankBalanceRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const bankName = req.query.bankName as string;
    if (!bankName) {
      return next(
        new ErrorHandler("Bank name is required", StatusCodes.BAD_REQUEST)
      );
    }

    const balance = await getBankBalance(bankName);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bank balance calculated",
      data: { bankName, balance },
    });
  }
);

export const updateBankLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = bankLedgerSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined,
    });

    const updatedEntry = await updateBankLedgerEntry(id, validatedData);
    if (!updatedEntry) {
      return next(
        new ErrorHandler("Bank ledger entry not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bank ledger entry updated successfully",
      data: updatedEntry,
    });
  }
);

export const deleteBankLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedEntry = await deleteBankLedgerEntry(id);
    if (!deletedEntry) {
      return next(
        new ErrorHandler("Bank ledger entry not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bank ledger entry deleted successfully",
      data: deletedEntry,
    });
  }
);

export const searchBankLedgerResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const results = await searchBankLedger(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bank ledger search results fetched",
      data: results,
    });
  }
);

export const filterBankLedger = catchAsyncError(async (req, res) => {
  const validated = bankLedgerFilterSchema.parse(req.query);

  const { data, nextCursor } = await filterBankLedgerService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered bank ledger fetched",
    data,
    pagination: {
      nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
      limit: validated.limit,
    },
  });
});
