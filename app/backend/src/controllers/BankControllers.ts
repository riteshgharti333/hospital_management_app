import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createBankAccount,
  getAllBankAccounts,
  getBankAccountById,
  updateBankAccount,
  deleteBankAccount,
  searchBankAccount,
  filterBankAccountsService,
  getBankAccountByAccountNo,
} from "../services/bankService";
import { bankSchema, bankFilterSchema } from "@hospital/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { validateSearchQuery } from "../utils/queryValidation";
import { PAGINATION_CONFIG } from "../lib/paginationConfig";

export const createBankAccountRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = bankSchema.parse(req.body);

    const existingBankAccount = await getBankAccountByAccountNo(
      validated.accountNo
    );
    if (existingBankAccount) {
      return next(
        new ErrorHandler(
          "Bank account with this account number already exists",
          StatusCodes.CONFLICT
        )
      );
    }

    const bankAccount = await createBankAccount(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Bank account created successfully",
      data: bankAccount,
    });
  }
);

export const getAllBankAccountRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor } = req.query as { cursor?: string };

    const result = await getAllBankAccounts(cursor);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bank account records fetched",
      data: result.data,
      pagination: {
        nextCursor: result.pagination.nextCursor || undefined,
        hasMore: result.pagination.hasMore,
      },
    });
  }
);

export const getBankAccountRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const bankAccount = await getBankAccountById(id);
    if (!bankAccount) {
      return next(
        new ErrorHandler("Bank account not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bank account details fetched",
      data: bankAccount,
    });
  }
);

export const updateBankAccountRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = bankSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    // Account number uniqueness check
    if (validatedData.accountNo) {
      const existingBankAccount = await getBankAccountByAccountNo(
        validatedData.accountNo
      );

      if (existingBankAccount && existingBankAccount.id !== id) {
        return next(
          new ErrorHandler(
            "Another bank account with this account number already exists",
            StatusCodes.CONFLICT
          )
        );
      }
    }

    const updatedBankAccount = await updateBankAccount(id, validatedData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bank account updated successfully",
      data: updatedBankAccount,
    });
  }
);

export const deleteBankAccountRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    try {
      const deletedBankAccount = await deleteBankAccount(id);

      if (!deletedBankAccount) {
        return next(
          new ErrorHandler("Bank account not found", StatusCodes.NOT_FOUND)
        );
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Bank account deleted successfully",
        data: deletedBankAccount,
      });
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        return next(
          new ErrorHandler(
            "Cannot delete bank account: Transactions linked to this account exist.",
            StatusCodes.CONFLICT
          )
        );
      }

      return next(
        new ErrorHandler(
          "An error occurred while deleting bank account",
          StatusCodes.INTERNAL_ERROR
        )
      );
    }
  }
);

export const searchBankAccountResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const bankAccounts = await searchBankAccount(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: bankAccounts,
    });
  }
);

export const filterBankAccounts = catchAsyncError(async (req, res) => {
  const validated = bankFilterSchema.parse(req.query);

  const { data, nextCursor, hasMore } = await filterBankAccountsService(
    validated
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered bank accounts fetched",
    data,
    pagination: {
      nextCursor: nextCursor || undefined,
      limit: validated.limit ?? PAGINATION_CONFIG.DEFAULT_LIMIT,
      hasMore,
    },
  });
});