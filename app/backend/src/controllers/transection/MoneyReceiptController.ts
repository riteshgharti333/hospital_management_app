import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createMoneyReceipt,
  getAllMoneyReceipts,
  getMoneyReceiptById,
  getMoneyReceiptsByDateRange,
  updateMoneyReceipt,
  deleteMoneyReceipt,
} from "../../services/transectionService/moneyReceiptService";

import {moneyReceiptSchema} from "@hospital/schemas" 

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
    const { mobile, patientName, amount, paymentMode } = req.query;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    
    let moneyReceipts;
    
    if (startDate && endDate) {
      moneyReceipts = await getMoneyReceiptsByDateRange(new Date(startDate), new Date(endDate));
    } else {
      moneyReceipts = await getAllMoneyReceipts({
        mobile: mobile as string | undefined,
        patientName: patientName as string | undefined,
        amount: amount ? Number(amount) : undefined,
        paymentMode: paymentMode as string | undefined
      });
    }
      
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Money receipts fetched successfully",
      data: moneyReceipts,
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
      return next(new ErrorHandler("Money receipt not found", StatusCodes.NOT_FOUND));
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
      return next(new ErrorHandler("Money receipt not found", StatusCodes.NOT_FOUND));
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
      return next(new ErrorHandler("Money receipt not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Money receipt deleted successfully",
      data: deletedMoneyReceipt,
    });
  }
);