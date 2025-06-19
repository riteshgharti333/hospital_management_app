import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createAmbulance,
  getAllAmbulances,
  getAmbulanceById,
  getAmbulanceByRegistration,
  updateAmbulance,
  deleteAmbulance,
} from "../services/ambulanceService";
import {ambulanceSchema} from "@hospital/schemas"

export const createAmbulanceRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = ambulanceSchema.parse(req.body);

    // Check if registration number already exists
    const existingAmbulance = await getAmbulanceByRegistration(validated.registrationNo);
    if (existingAmbulance) {
      return next(
        new ErrorHandler(
          "Ambulance with this registration number already exists",
          StatusCodes.CONFLICT
        )
      );
    }

    const ambulance = await createAmbulance(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Ambulance created successfully",
      data: ambulance,
    });
  }
);

export const getAllAmbulanceRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const status = req.query.status as string | undefined;
    const ambulances = await getAllAmbulances(status);
    
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: status
        ? `Ambulances with status ${status} fetched`
        : "All ambulances fetched",
      data: ambulances,
    });
  }
);

export const getAmbulanceRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const ambulance = await getAmbulanceById(id);
    if (!ambulance) {
      return next(new ErrorHandler("Ambulance not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ambulance details fetched",
      data: ambulance,
    });
  }
);

export const updateAmbulanceRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = ambulanceSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    // Check if updating registration number to an existing one
    if (validatedData.registrationNo) {
      const existingAmbulance = await getAmbulanceByRegistration(validatedData.registrationNo);
      if (existingAmbulance && existingAmbulance.id !== id) {
        return next(
          new ErrorHandler(
            "Another ambulance with this registration number already exists",
            StatusCodes.CONFLICT
          )
        );
      }
    }

    const updatedAmbulance = await updateAmbulance(id, validatedData);
    if (!updatedAmbulance) {
      return next(new ErrorHandler("Ambulance not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ambulance updated successfully",
      data: updatedAmbulance,
    });
  }
);

export const deleteAmbulanceRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedAmbulance = await deleteAmbulance(id);
    if (!deletedAmbulance) {
      return next(new ErrorHandler("Ambulance not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Ambulance deleted successfully",
      data: deletedAmbulance,
    });
  }
);