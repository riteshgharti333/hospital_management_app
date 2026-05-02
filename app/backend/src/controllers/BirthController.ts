import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createBirth,
  getAllBirthService,
  getBirthById,
  updateBirth,
  deleteBirth,
  searchBirth,
  filterBirthsService,
} from "../services/birthService";
import { birthFilterSchema, birthSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../utils/queryValidation";
import { PAGINATION_CONFIG } from "../lib/paginationConfig";

export const createBirthRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = birthSchema.parse(req.body);
    const birth = await createBirth(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Birth record created successfully",
      data: birth,
    });
  },
);

export const getAllBirthRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor } = req.query as { cursor?: string };

    const result = await getAllBirthService(cursor);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Birth records fetched",
      data: result.data,
      pagination: {
        nextCursor: result.pagination.nextCursor || undefined,
        hasMore: result.pagination.hasMore,
      },
    });
  },
);

export const getBirthRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const birth = await getBirthById(id);
    if (!birth) {
      return next(new ErrorHandler("Birth record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Birth record details fetched",
      data: birth,
    });
  },
);

export const updateBirthRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = birthSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedBirth = await updateBirth(id, validatedData);
    if (!updatedBirth) {
      return next(new ErrorHandler("Birth record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Birth record updated successfully",
      data: updatedBirth,
    });
  },
);

export const deleteBirthRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedBirth = await deleteBirth(id);
    if (!deletedBirth) {
      return next(new ErrorHandler("Birth record not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Birth record deleted successfully",
      data: deletedBirth,
    });
  },
);



export const searchBirthResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query, cursor } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const result = await searchBirth(searchTerm as string, cursor as string);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: result.data,
      pagination: {
        nextCursor: result.pagination.nextCursor || undefined,
        hasMore: result.pagination.hasMore,
      },
    });
  },
);

export const filterBirths = catchAsyncError(async (req, res) => {
  const validated = birthFilterSchema.parse(req.query);

  const result = await filterBirthsService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered births fetched",
    data: result.data,
    pagination: {
      nextCursor: result.nextCursor || undefined,
      hasMore: result.hasMore,
    },
  });
});