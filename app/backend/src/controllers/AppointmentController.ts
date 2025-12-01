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
  searchAppointment,
} from "../services/appointmentService";

import { appointmentSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../utils/queryValidation";

export const createAppointmentRecord = catchAsyncError(
  async (req: Request, res: Response) => {
    const validated = appointmentSchema.parse(req.body);

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
  async (req: Request, res: Response) => {
    const { cursor, limit } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const { data: appointment, nextCursor } = await getAllAppointments(
      cursor,
      limit ? Number(limit) : undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment records fetched",
      data: appointment,
      pagination: {
        nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
        limit: limit ? Number(limit) : 50,
      },
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
      return next(
        new ErrorHandler("Appointment not found", StatusCodes.NOT_FOUND)
      );
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
      appointmentDate: req.body.appointmentDate
        ? new Date(req.body.appointmentDate)
        : undefined,
    });

    const updatedAppointment = await updateAppointment(id, validatedData);
    if (!updatedAppointment) {
      return next(
        new ErrorHandler("Appointment not found", StatusCodes.NOT_FOUND)
      );
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
      return next(
        new ErrorHandler("Appointment not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment deleted successfully",
      data: deletedAppointment,
    });
  }
);

export const searchAppointmentResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const appointments = await searchAppointment(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: appointments,
    });
  }
);
