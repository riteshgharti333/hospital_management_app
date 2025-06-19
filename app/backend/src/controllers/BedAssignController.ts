import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createBedAssignment,
  getAllBedAssignments,
  getBedAssignmentById,
  getAssignmentsByBed,
  getAssignmentsByWard,
  getActiveAssignments,
  updateBedAssignment,
  dischargePatient,
  deleteBedAssignment,
} from "../services/bedAssignService";

import {bedAssignmentSchema} from "@hospital/schemas"

export const createBedAssignmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = bedAssignmentSchema.parse({
      ...req.body,
      allocateDate: new Date(req.body.allocateDate)
    });

    const assignment = await createBedAssignment(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Bed assignment created successfully",
      data: assignment,
    });
  }
)

export const getAllBedAssignmentRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { ward, bed, status } = req.query;
    
    let assignments;
    if (ward) {
      assignments = await getAssignmentsByWard(ward as string);
    } else if (bed) {
      assignments = await getAssignmentsByBed(bed as string);
    } else if (status === "Active") {
      assignments = await getActiveAssignments();
    } else {
      assignments = await getAllBedAssignments();
    }
    
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bed assignments fetched successfully",
      data: assignments,
    });
  }
);

export const getBedAssignmentRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const assignment = await getBedAssignmentById(id);
    if (!assignment) {
      return next(new ErrorHandler("Bed assignment not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bed assignment details fetched",
      data: assignment,
    });
  }
);

export const updateBedAssignmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = bedAssignmentSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      allocateDate: req.body.allocateDate ? new Date(req.body.allocateDate) : undefined,
      dischargeDate: req.body.dischargeDate ? new Date(req.body.dischargeDate) : undefined
    });

    const updatedAssignment = await updateBedAssignment(id, validatedData);
    if (!updatedAssignment) {
      return next(new ErrorHandler("Bed assignment not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bed assignment updated successfully",
      data: updatedAssignment,
    });
  }
);

export const dischargePatientFromBed = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const dischargeDate = new Date(req.body.dischargeDate || new Date());
    const dischargedAssignment = await dischargePatient(id, dischargeDate);
    if (!dischargedAssignment) {
      return next(new ErrorHandler("Bed assignment not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Patient discharged successfully",
      data: dischargedAssignment,
    });
  }
);

export const deleteBedAssignmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedAssignment = await deleteBedAssignment(id);
    if (!deletedAssignment) {
      return next(new ErrorHandler("Bed assignment not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Bed assignment deleted successfully",
      data: deletedAssignment,
    });
  }
);