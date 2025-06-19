import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  getBrandByName,
  updateBrand,
  deleteBrand,
} from "../../services/itemService/brandService";
import {brandSchema} from "@hospital/schemas"


export const createBrandRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { file } = req;

    // Parse and validate req.body
    const validated = brandSchema.parse({
      ...req.body,
      brandLogo: file?.path // This can be string or undefined
    });

    // Check for duplicate brand name
    const existing = await getBrandByName(validated.brandName);
    if (existing) {
      return next(
        new ErrorHandler("Brand with this name already exists", StatusCodes.CONFLICT)
      );
    }

    // Create brand - no need for separate payload object
    const brand = await createBrand(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Brand created successfully",
      data: brand,
    });
  }
);

export const getAllBrandRecords = catchAsyncError(
  async (_req: Request, res: Response) => {
    const brands = await getAllBrands();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All brands fetched",
      data: brands,
    });
  }
);

export const getBrandRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const brand = await getBrandById(id);
    if (!brand) {
      return next(new ErrorHandler("Brand not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Brand details fetched",
      data: brand,
    });
  }
);

export const updateBrandRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const validated = brandSchema.partial().parse(req.body);

    if (validated.brandName) {
      const existing = await getBrandByName(validated.brandName);
      if (existing && existing.id !== id) {
        return next(
          new ErrorHandler("Another brand with this name already exists", StatusCodes.CONFLICT)
        );
      }
    }

    const updated = await updateBrand(id, validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Brand updated successfully",
      data: updated,
    });
  }
);

export const deleteBrandRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deleted = await deleteBrand(id);
    if (!deleted) {
      return next(new ErrorHandler("Brand not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Brand deleted successfully",
      data: deleted,
    });
  }
);
