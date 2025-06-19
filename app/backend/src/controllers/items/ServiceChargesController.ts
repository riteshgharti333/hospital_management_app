import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createServiceCharge,
  getAllServiceCharges,
  getServiceChargeById,
  getServiceChargesByCategory,
  updateServiceCharge,
  deleteServiceCharge,
} from "../../services/itemService/serviceChargesService";
import {serviceChargeSchema} from "@hospital/schemas"



export const createServiceChargeRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = serviceChargeSchema.parse(req.body);
    const serviceCharge = await createServiceCharge(validated);
    
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Service charge created successfully",
      data: serviceCharge,
    });
  }
);

export const getAllServiceChargeRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    
    const serviceCharges = category 
      ? await getServiceChargesByCategory(category)
      : await getAllServiceCharges();
      
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: category
        ? `Service charges in ${category} category fetched`
        : "All service charges fetched",
      data: serviceCharges,
    });
  }
);

export const getServiceChargeRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const serviceCharge = await getServiceChargeById(id);
    if (!serviceCharge) {
      return next(new ErrorHandler("Service charge not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Service charge details fetched",
      data: serviceCharge,
    });
  }
);

export const updateServiceChargeRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = serviceChargeSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    // Validate tax percentage if tax is applicable
    if (validatedData.taxApplicable && !validatedData.taxPercentage) {
      return next(new ErrorHandler("Tax percentage is required when tax is applicable", StatusCodes.BAD_REQUEST));
    }

    const updatedServiceCharge = await updateServiceCharge(id, validatedData);
    if (!updatedServiceCharge) {
      return next(new ErrorHandler("Service charge not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Service charge updated successfully",
      data: updatedServiceCharge,
    });
  }
);

export const deleteServiceChargeRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedServiceCharge = await deleteServiceCharge(id);
    if (!deletedServiceCharge) {
      return next(new ErrorHandler("Service charge not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Service charge deleted successfully",
      data: deletedServiceCharge,
    });
  }
);