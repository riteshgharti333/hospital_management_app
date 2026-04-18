import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createBill,
  getAllBillsService,
  getBillById,
  updateBill,
  searchBills,
  deleteBill,
  filterBillsService,
} from "../../services/transectionService/billService";
import { billSchema, billFilterSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../../utils/queryValidation";
import { PAGINATION_CONFIG } from "../../lib/paginationConfig";


export const createBillRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Calculate totalAmount from billItems BEFORE validation
    const calculatedTotalAmount = req.body.billItems?.reduce(
      (sum: number, item: any) => {
        const itemTotal = item.totalAmount ?? (item.mrp * item.quantity);
        return sum + (itemTotal || 0);
      },
      0
    ) || 0;

    // Add totalAmount to request body
    req.body.totalAmount = calculatedTotalAmount;
    
    // Now validate with Zod (totalAmount exists)
    const validated = billSchema.parse(req.body);
    
    // Create bill
    const bill = await createBill(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Bill created successfully",
      data: bill,
    });
  },  
);

export const getAllBillRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor } = req.query as { cursor?: string };

    const result = await getAllBillsService(cursor);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bill records fetched",
      data: result.data,
      pagination: {
        nextCursor: result.pagination.nextCursor || undefined,
        hasMore: result.pagination.hasMore,
      },
    });
  },
);

export const getBillRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const bill = await getBillById(id);
    if (!bill) {
      return next(new ErrorHandler("Bill not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bill details fetched",
      data: bill,
    });
  },
);

export const updateBillRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const partialSchema = billSchema.partial();
    const validated = partialSchema.parse(req.body);

    // Transform data to match updateBill expectations
    const updateData = {
      ...validated,
      dischargeDate: validated.dischargeDate ?? undefined,
      billItems: validated.billItems ?? undefined,
    };

    const updatedBill = await updateBill(id, updateData);
    if (!updatedBill) {
      return next(new ErrorHandler("Bill not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bill updated successfully",
      data: updatedBill,
    });
  },
);

export const deleteBillRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedBill = await deleteBill(id);
    if (!deletedBill) {
      return next(new ErrorHandler("Bill not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bill deleted successfully",
      data: deletedBill,
    });
  },
);

export const searchBillsResults = catchAsyncError(async (req, res, next) => {
  const { query } = req.query;

  const searchTerm = validateSearchQuery(query, next);
  if (!searchTerm) return;

  const results = await searchBills(searchTerm);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Bill search results fetched",
    data: results,
  });
});

export const filterBills = catchAsyncError(async (req, res) => {
  const validated = billFilterSchema.parse(req.query);

  const { data, nextCursor, hasMore } = await filterBillsService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered Bills fetched",
    data,
    pagination: {
      nextCursor: nextCursor || undefined,
      limit: validated.limit ?? PAGINATION_CONFIG.DEFAULT_LIMIT,
      hasMore,
    },
  });
}); 
