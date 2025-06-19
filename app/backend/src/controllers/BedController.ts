import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createBed,
  getAllBeds,
  getBedById,
  getBedByNumber,
  getBedsByWard,
  updateBed,
  deleteBed,
} from "../services/bedService";
import { bedSchema } from "@hospital/schemas";

export const createBedRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = bedSchema.parse(req.body);

    const existingBed = await getBedByNumber(validated.bedNumber);
    if (existingBed) {
      return next(
        new ErrorHandler(
          "Bed with this number already exists",
          StatusCodes.CONFLICT
        )
      );
    }

    const bed = await createBed(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Bed created successfully",
      data: bed,
    });
  }
);

export const getAllBedRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    // Optional ward filter
    const wardNumber = req.query.ward as string | undefined;

    const beds = wardNumber
      ? await getBedsByWard(wardNumber)
      : await getAllBeds();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: wardNumber
        ? `Beds in ward ${wardNumber} fetched`
        : "All beds fetched",
      data: beds,
    });
  }
);

export const getBedRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const bed = await getBedById(id);
    if (!bed) {
      return next(new ErrorHandler("Bed not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bed details fetched",
      data: bed,
    });
  }
);

export const updateBedRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = bedSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    // Check if updating bed number to an existing one
    if (validatedData.bedNumber) {
      const existingBed = await getBedByNumber(validatedData.bedNumber);
      if (existingBed && existingBed.id !== id) {
        return next(
          new ErrorHandler(
            "Another bed with this number already exists",
            StatusCodes.CONFLICT
          )
        );
      }
    }

    const updatedBed = await updateBed(id, validatedData);
    if (!updatedBed) {
      return next(new ErrorHandler("Bed not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bed updated successfully",
      data: updatedBed,
    });
  }
);

export const deleteBedRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedBed = await deleteBed(id);
    if (!deletedBed) {
      return next(new ErrorHandler("Bed not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bed deleted successfully",
      data: deletedBed,
    });
  }
);
