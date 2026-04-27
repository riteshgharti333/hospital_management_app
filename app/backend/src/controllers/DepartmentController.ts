import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  searchDepartment,
  filterDepartmentsService,
} from "../services/departmentService";
import { departmentSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../utils/queryValidation";
import { PAGINATION_CONFIG } from "../lib/paginationConfig";

export const createDepartmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = departmentSchema.parse(req.body);
    const department = await createDepartment(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Department record created successfully",
      data: department,
    });
  },
);

export const getAllDepartmentRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor } = req.query as { cursor?: string };

    const result = await getAllDepartments(cursor);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Department records fetched",
      data: result.data,
      pagination: {
        nextCursor: result.pagination.nextCursor || undefined,
        hasMore: result.pagination.hasMore,
      },
    });
  },
);

export const getDepartmentRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const department = await getDepartmentById(id);
    if (!department) {
      return next(new ErrorHandler("Department not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Department details fetched",
      data: department,
    });
  },
);

export const updateDepartmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = departmentSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedDepartment = await updateDepartment(id, validatedData);
    if (!updatedDepartment) {
      return next(new ErrorHandler("Department not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Department updated successfully",
      data: updatedDepartment,
    });
  },
);

export const deleteDepartmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedDepartment = await deleteDepartment(id);
    if (!deletedDepartment) {
      return next(new ErrorHandler("Department not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Department deleted successfully",
      data: deletedDepartment,
    });
  },
);

export const searchDepartmentResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const departments = await searchDepartment(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: departments,
    });
  },
);

export const filterDepartments = catchAsyncError(async (req, res) => {
  const validated = departmentSchema.partial().pick({
    status: true,
  }).extend({
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    cursor: z.string().optional(),
    limit: z.coerce.number().optional(),
  }).parse(req.query);

  const { data, nextCursor, hasMore } = await filterDepartmentsService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered departments fetched",
    data,
    pagination: {
      nextCursor: nextCursor || undefined,
      limit: validated.limit ?? PAGINATION_CONFIG.DEFAULT_LIMIT,
      hasMore,
    },
  });
});