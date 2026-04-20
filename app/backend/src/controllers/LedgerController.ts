import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createLedger,
  getAllLedgers,
  getLedgerById,
  updateLedger,
  deleteLedger,
  searchLedger,
  filterLedgersService,
  getLedgersByEntity,
  getCurrentBalance,
  getLedgerByCode,
} from "../services/ledgerService";
import { ledgerSchema, ledgerFilterSchema } from "@hospital/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { validateSearchQuery } from "../utils/queryValidation";
import { PAGINATION_CONFIG } from "../lib/paginationConfig";

export const createLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = ledgerSchema.parse(req.body);

    const ledger = await createLedger(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Ledger entry created successfully",
      data: ledger,
    });
  }
);

export const getAllLedgerRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor } = req.query as { cursor?: string };

    const result = await getAllLedgers(cursor);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ledger records fetched",
      data: result.data,
      pagination: {
        nextCursor: result.pagination.nextCursor || undefined,
        hasMore: result.pagination.hasMore,
      },
    });
  }
);

export const getLedgerRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const ledger = await getLedgerById(id);
    if (!ledger) {
      return next(new ErrorHandler("Ledger entry not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ledger details fetched",
      data: ledger,
    });
  }
);


export const getLedgersByEntityRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { entityType } = req.params;

    // Fix: Ensure entityType is a string
    const entityTypeStr = Array.isArray(entityType) ? entityType[0] : entityType;

    const ledgers = await getLedgersByEntity(entityTypeStr);
    const balance = await getCurrentBalance(entityTypeStr);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Entity ledger entries fetched",
      data: {
        transactions: ledgers,
        currentBalance: balance,
      },
    });
  }
);

export const updateLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = ledgerSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedLedger = await updateLedger(id, validatedData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ledger entry updated successfully",
      data: updatedLedger,
    });
  }
);

export const deleteLedgerRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    try {
      const deletedLedger = await deleteLedger(id);

      if (!deletedLedger) {
        return next(
          new ErrorHandler("Ledger entry not found", StatusCodes.NOT_FOUND)
        );
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Ledger entry deleted successfully",
        data: deletedLedger,
      });
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        return next(
          new ErrorHandler(
            "Cannot delete ledger entry: Related records exist.",
            StatusCodes.CONFLICT
          )
        );
      }

      return next(
        new ErrorHandler(
          "An error occurred while deleting ledger entry",
          StatusCodes.INTERNAL_ERROR
        )
      );
    }
  }
);

export const searchLedgerResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const ledgers = await searchLedger(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: ledgers,
    });
  }
);

export const filterLedgers = catchAsyncError(async (req, res) => {
  const validated = ledgerFilterSchema.parse(req.query);

  const { data, nextCursor, hasMore } = await filterLedgersService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered ledger entries fetched",
    data,
    pagination: {
      nextCursor: nextCursor || undefined,
      limit: validated.limit ?? PAGINATION_CONFIG.DEFAULT_LIMIT,
      hasMore,
    },
  });
});