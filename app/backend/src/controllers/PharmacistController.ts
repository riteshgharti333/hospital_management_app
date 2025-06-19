import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createPharmacist,
  getAllPharmacists,
  getPharmacistById,
  getPharmacistByRegistration,
  getPharmacistsByDepartment,
  updatePharmacist,
  deletePharmacist,
} from "../services/pharmacistService";
import { pharmacistSchema } from "@hospital/schemas";
// import {medicineSchema} from "@hospital/schemas"

export const createPharmacistRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = pharmacistSchema.parse(req.body);

    // Check if registration number already exists
    const existingPharmacist = await getPharmacistByRegistration(validated.registrationNo);
    if (existingPharmacist) {
      return next(
        new ErrorHandler(
          "Pharmacist with this registration number already exists",
          StatusCodes.CONFLICT
        )
      );
    }

    const pharmacist = await createPharmacist(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Pharmacist created successfully",
      data: pharmacist,
    });
  }
);

export const getAllPharmacistRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const department = req.query.department as string | undefined;
    
    const pharmacists = department 
      ? await getPharmacistsByDepartment(department)
      : await getAllPharmacists();
      
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: department
        ? `Pharmacists in ${department} department fetched`
        : "All pharmacists fetched",
      data: pharmacists,
    });
  }
);

export const getPharmacistRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const pharmacist = await getPharmacistById(id);
    if (!pharmacist) {
      return next(new ErrorHandler("Pharmacist not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Pharmacist details fetched",
      data: pharmacist,
    });
  }
);

export const updatePharmacistRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = pharmacistSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    // Check if updating registration number to an existing one
    if (validatedData.registrationNo) {
      const existingPharmacist = await getPharmacistByRegistration(validatedData.registrationNo);
      if (existingPharmacist && existingPharmacist.id !== id) {
        return next(
          new ErrorHandler(
            "Another pharmacist with this registration number already exists",
            StatusCodes.CONFLICT
          )
        );
      }
    }

    const updatedPharmacist = await updatePharmacist(id, validatedData);
    if (!updatedPharmacist) {
      return next(new ErrorHandler("Pharmacist not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Pharmacist updated successfully",
      data: updatedPharmacist,
    });
  }
);

export const deletePharmacistRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedPharmacist = await deletePharmacist(id);
    if (!deletedPharmacist) {
      return next(new ErrorHandler("Pharmacist not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Pharmacist deleted successfully",
      data: deletedPharmacist,
    });
  }
);