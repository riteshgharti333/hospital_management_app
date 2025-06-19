import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../services/appointmentService";

import {appointmentSchema} from "@hospital/schemas"

export const createAppointmentRecord = catchAsyncError(
  async (req: Request, res: Response) => {
    const validated = appointmentSchema.parse({
      ...req.body,
      appointmentDate: new Date(req.body.appointmentDate)
    });

    const appointment = await createAppointment(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Appointment created successfully",
      data: appointment,
    });
  }
);

export const getAllAppointmentRecords = catchAsyncError(
  async (_req: Request, res: Response) => {
    const appointments = await getAllAppointments();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  }
);

export const getAppointmentRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const appointment = await getAppointmentById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment details fetched",
      data: appointment,
    });
  }
);

export const updateAppointmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = appointmentSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      appointmentDate: req.body.appointmentDate ? new Date(req.body.appointmentDate) : undefined
    });

    const updatedAppointment = await updateAppointment(id, validatedData);
    if (!updatedAppointment) {
      return next(new ErrorHandler("Appointment not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    });
  }
);

export const deleteAppointmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedAppointment = await deleteAppointment(id);
    if (!deletedAppointment) {
      return next(new ErrorHandler("Appointment not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment deleted successfully",
      data: deletedAppointment,
    });
  }
);