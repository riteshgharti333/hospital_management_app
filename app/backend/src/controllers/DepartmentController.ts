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
import { departmentFilterSchema, departmentSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../utils/queryValidation";
import { PAGINATION_CONFIG } from "../lib/paginationConfig";
import { prisma } from "../lib/prisma";

export const createDepartmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = departmentSchema.parse(req.body);

    // Check if department name already exists
    const existingDepartment = await prisma.department.findUnique({
      where: { name: validated.name },
    });

    if (existingDepartment) {
      return sendResponse(res, {
        success: false,
        statusCode: StatusCodes.CONFLICT,
        message: "Department already exists",
        data: null,
      });
    }

    // Check if doctor is already assigned to a department
    const existingHead = await prisma.department.findUnique({
      where: { headId: validated.headId },
    });

    if (existingHead) {
      return sendResponse(res, {
        success: false,
        statusCode: StatusCodes.CONFLICT,
        message: "Doctor already assigned to a department",
        data: null,
      });
    }

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
      return next(
        new ErrorHandler("Department not found", StatusCodes.NOT_FOUND),
      );
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

    // 🔍 Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id },
    });

    if (!existingDepartment) {
      return next(
        new ErrorHandler("Department not found", StatusCodes.NOT_FOUND),
      );
    }

    // 🔴 Check duplicate name (exclude current)
    if (validatedData.name) {
      const duplicateName = await prisma.department.findFirst({
        where: {
          name: validatedData.name,
          NOT: { id },
        },
      });

      if (duplicateName) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.CONFLICT,
          message: "Department already exists",
          data: null,
        });
      }
    }

    // 🔴 Check doctor already assigned (exclude current)
    if (validatedData.headId) {
      const existingHead = await prisma.department.findFirst({
        where: {
          headId: validatedData.headId,
          NOT: { id },
        },
      });

      if (existingHead) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.CONFLICT,
          message: "Doctor already assigned to a department",
          data: null,
        });
      }
    }

    const updatedDepartment = await updateDepartment(id, validatedData);

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
      return next(
        new ErrorHandler("Department not found", StatusCodes.NOT_FOUND),
      );
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
  const validated = departmentFilterSchema.parse(req.query);

  const { data, nextCursor, hasMore } =
    await filterDepartmentsService(validated);

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
