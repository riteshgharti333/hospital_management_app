import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createExpenseEntry,
  getAllExpenseEntries,
  getExpenseEntryById,
  getExpenseSummaryByCategory,
  getTotalExpenses,
  updateExpenseEntry,
  deleteExpenseEntry,
} from "../../services/ledgerService/expenseLedgerService";

import { expenseLedgerSchema } from "@hospital/schemas";

export const createExpenseRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = expenseLedgerSchema.parse({
      ...req.body,
      date: new Date(req.body.date)
    });

    const entry = await createExpenseEntry(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Expense record created successfully",
      data: entry,
    });
  }
);

export const getAllExpenseRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const filters = {
      expenseCategory: req.query.expenseCategory as string | undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
    };

    const entries = await getAllExpenseEntries(filters);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Expense records fetched successfully",
      data: entries,
    });
  }
);

export const getExpenseRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const entry = await getExpenseEntryById(id);
    if (!entry) {
      return next(new ErrorHandler("Expense record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Expense record details fetched",
      data: entry,
    });
  }
);

export const getExpenseSummary = catchAsyncError(
  async (_req: Request, res: Response) => {
    const summary = await getExpenseSummaryByCategory();
    const total = await getTotalExpenses();
    
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Expense summary calculated",
      data: { summary, total },
    });
  }
);

export const updateExpenseRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = expenseLedgerSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined
    });

    const updatedEntry = await updateExpenseEntry(id, validatedData);
    if (!updatedEntry) {
      return next(new ErrorHandler("Expense record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Expense record updated successfully",
      data: updatedEntry,
    });
  }
);

export const deleteExpenseRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedEntry = await deleteExpenseEntry(id);
    if (!deletedEntry) {
      return next(new ErrorHandler("Expense record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Expense record deleted successfully",
      data: deletedEntry,
    });
  }
);