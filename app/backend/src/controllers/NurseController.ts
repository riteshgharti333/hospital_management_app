import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createNurse,
  getAllNurses,
  getNurseById,
  getNurseByRegistration,
  updateNurse,
  deleteNurse,
} from "../services/nurseService";
import { nurseSchema } from "@hospital/schemas";


export const createNurseRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = nurseSchema.parse(req.body);

    // Check if registration number already exists
    const existingNurse = await getNurseByRegistration(validated.registrationNo);
    if (existingNurse) {
      return next(
        new ErrorHandler(
          "Nurse with this registration number already exists",
          StatusCodes.CONFLICT
        )
      );
    }

    const nurse = await createNurse(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Nurse created successfully",
      data: nurse,
    });
  }
);

export const getAllNurseRecords = catchAsyncError(
  async (_req: Request, res: Response) => {
    const nurses = await getAllNurses();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All nurses fetched successfully",
      data: nurses,
    });
  }
);

export const getNurseRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const nurse = await getNurseById(id);
    if (!nurse) {
      return next(new ErrorHandler("Nurse not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Nurse details fetched",
      data: nurse,
    });
  }
);

export const updateNurseRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = nurseSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    // Check if updating registration number to an existing one
    if (validatedData.registrationNo) {
      const existingNurse = await getNurseByRegistration(validatedData.registrationNo);
      if (existingNurse && existingNurse.id !== id) {
        return next(
          new ErrorHandler(
            "Another nurse with this registration number already exists",
            StatusCodes.CONFLICT
          )
        );
      }
    }

    const updatedNurse = await updateNurse(id, validatedData);
    if (!updatedNurse) {
      return next(new ErrorHandler("Nurse not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Nurse updated successfully",
      data: updatedNurse,
    });
  }
);

export const deleteNurseRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedNurse = await deleteNurse(id);
    if (!deletedNurse) {
      return next(new ErrorHandler("Nurse not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Nurse deleted successfully",
      data: deletedNurse,
    });
  }
);