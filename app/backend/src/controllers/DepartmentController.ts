import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createDepartment,
  getDepartmentById,
  getDepartmentByName,
  updateDepartment,
  deleteDepartment,
  searchDepartment,
  getAllDepartmentService,
  filterDepartmentsService,
} from "../services/departmentService";

import { departmentFilterSchema, departmentSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../utils/queryValidation";

export const createDepartmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = departmentSchema.parse(req.body);

    // Check if department name already exists
    const existingDept = await getDepartmentByName(validated.name);
    if (existingDept) {
      return next(
        new ErrorHandler(
          "Department with this name already exists",
          StatusCodes.CONFLICT
        )
      );
    }

    const department = await createDepartment(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Department created successfully",
      data: department,
    });
  }
);

export const getAllDepartmentRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor, limit } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const { data: department, nextCursor } = await getAllDepartmentService(
      cursor,
      limit ? Number(limit) : undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Department records fetched",
      data: department,
      pagination: {
        nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
        limit: limit ? Number(limit) : 50,
      },
    });
  }
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
        new ErrorHandler("Department not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Department details fetched",
      data: department,
    });
  }
);

export const updateDepartmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = departmentSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    // Check if updating name to an existing one
    if (validatedData.name) {
      const existingDept = await getDepartmentByName(validatedData.name);
      if (existingDept && existingDept.id !== id) {
        return next(
          new ErrorHandler(
            "Another department with this name already exists",
            StatusCodes.CONFLICT
          )
        );
      }
    }

    const updatedDepartment = await updateDepartment(id, validatedData);
    if (!updatedDepartment) {
      return next(
        new ErrorHandler("Department not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Department updated successfully",
      data: updatedDepartment,
    });
  }
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
        new ErrorHandler("Department not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Department deleted successfully",
      data: deletedDepartment,
    });
  }
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
  }
);


export const filterDepartments = catchAsyncError(async (req, res) => {
  const validated = departmentFilterSchema.parse(req.query);

  const { data, nextCursor } = await filterDepartmentsService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered departments fetched",
    data,
    pagination: {
      nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
      limit: validated.limit || 50,
    },
  });
});
