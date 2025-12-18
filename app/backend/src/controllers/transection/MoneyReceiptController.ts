import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createMoneyReceipt,
  getMoneyReceiptById,
  updateMoneyReceipt,
  deleteMoneyReceipt,
  getAllMoneyReceiptsService,
  filterMoneyReceiptsService,
  searchMoneyReceipts,
} from "../../services/transectionService/moneyReceiptService";

import {
  moneyReceiptFilterSchema,
  moneyReceiptSchema,
} from "@hospital/schemas";
import { validateSearchQuery } from "../../utils/queryValidation";

export const createMoneyReceiptRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = moneyReceiptSchema.parse(req.body);
    const moneyReceipt = await createMoneyReceipt(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Money receipt created successfully",
      data: moneyReceipt,
    });
  }
);

export const getAllMoneyReceiptRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor, limit } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const { data: receipts, nextCursor } = await getAllMoneyReceiptsService(
      cursor,
      limit ? Number(limit) : undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Money receipt records fetched",
      data: receipts,
      pagination: {
        nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
        limit: limit ? Number(limit) : 50,
      },
    });
  }
);

export const getMoneyReceiptRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const moneyReceipt = await getMoneyReceiptById(id);
    if (!moneyReceipt) {
      return next(
        new ErrorHandler("Money receipt not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Money receipt details fetched",
      data: moneyReceipt,
    });
  }
);

export const updateMoneyReceiptRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = moneyReceiptSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedMoneyReceipt = await updateMoneyReceipt(id, validatedData);
    if (!updatedMoneyReceipt) {
      return next(
        new ErrorHandler("Money receipt not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Money receipt updated successfully",
      data: updatedMoneyReceipt,
    });
  }
);

export const deleteMoneyReceiptRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedMoneyReceipt = await deleteMoneyReceipt(id);
    if (!deletedMoneyReceipt) {
      return next(
        new ErrorHandler("Money receipt not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Money receipt deleted successfully",
      data: deletedMoneyReceipt,
    });
  }
);

export const searchMoneyReceiptResults = catchAsyncError(
  async (req, res, next) => {
    const { query } = req.query;
    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const receipts = await searchMoneyReceipts(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Search results fetched successfully",
      data: receipts,
    });
  }
);

export const filterMoneyReceipts = catchAsyncError(async (req, res) => {
  const validated = moneyReceiptFilterSchema.parse(req.query);

  const { data, nextCursor } = await filterMoneyReceiptsService(validated);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Filtered money receipts fetched",
    data,
    pagination: {
      nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
      limit: validated.limit || 50,
    },
  });
});

