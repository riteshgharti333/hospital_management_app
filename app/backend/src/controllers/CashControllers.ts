import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createCashAccount,
  getAllCashAccounts,
  getCashAccountById,
  updateCashAccount,
  deleteCashAccount,
  searchCashAccount,
  filterCashAccountsService,
  getCashAccountByName,
} from "../services/cashService";
import { cashSchema, cashFilterSchema } from "@hospital/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { validateSearchQuery } from "../utils/queryValidation";
import { PAGINATION_CONFIG } from "../lib/paginationConfig";

export const createCashAccountRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = cashSchema.parse(req.body);

    const existingCashAccount = await getCashAccountByName(validated.cashName);
    if (existingCashAccount) {
      return next(
        new ErrorHandler(
          "Cash account with this name already exists",
          StatusCodes.CONFLICT,
        ),
      );
    }

    const cashAccount = await createCashAccount(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Cash account created successfully",
      data: cashAccount,
    });
  },
);

export const getAllCashAccountRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor } = req.query as { cursor?: string };

    const result = await getAllCashAccounts(cursor);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cash account records fetched",
      data: result.data,
      pagination: {
        nextCursor: result.pagination.nextCursor || undefined,
        hasMore: result.pagination.hasMore,
      },
    });
  },
);

export const getCashAccountRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const cashAccount = await getCashAccountById(id);
    if (!cashAccount) {
      return next(new ErrorHandler("Cash account not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cash account details fetched",
      data: cashAccount,
    });
  },
);

export const updateCashAccountRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = cashSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    // Name uniqueness check
    if (validatedData.cashName) {
      const existingCashAccount = await getCashAccountByName(validatedData.cashName);

      if (existingCashAccount && existingCashAccount.id !== id) {
        return next(
          new ErrorHandler(
            "Another cash account with this name already exists",
            StatusCodes.CONFLICT,
          ),
        );
      }
    }

    const updatedCashAccount = await updateCashAccount(id, validatedData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cash account updated successfully",
      data: updatedCashAccount,
    });
  },
);

export const deleteCashAccountRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    try {
      const deletedCashAccount = await deleteCashAccount(id);

      if (!deletedCashAccount) {
        return next(
          new ErrorHandler("Cash account not found", StatusCodes.NOT_FOUND),
        );
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Cash account deleted successfully",
        data: deletedCashAccount,
      });
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        return next(
          new ErrorHandler(
            "Cannot delete cash account: Transactions linked to this account exist.",
            StatusCodes.CONFLICT,
          ),
        );
      }

      return next(
        new ErrorHandler(
          "An error occurred while deleting cash account",
          StatusCodes.INTERNAL_ERROR,
        ),
      );
    }
  },
);

export const searchCashAccountResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const cashAccounts = await searchCashAccount(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: cashAccounts,
    });
  },
);

export const filterCashAccounts = catchAsyncError(async (req, res) => {
  const validated = cashFilterSchema.parse(req.query);

  const { data, nextCursor, hasMore } = await filterCashAccountsService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered cash accounts fetched",
    data,
    pagination: {
      nextCursor: nextCursor || undefined,
      limit: validated.limit ?? PAGINATION_CONFIG.DEFAULT_LIMIT,
      hasMore,
    },
  });
});