import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  getAllAppointmentsService,
  filterAppointmentsService,
  searchAppointments,
  updateExpiredAppointments,
} from "../services/appointmentService";
import { PAGINATION_CONFIG } from "../lib/paginationConfig";

import {
  appointmentFilterSchema,
  appointmentSchema,
  AppointmentStatus,
} from "@hospital/schemas";
import { prisma } from "../lib/prisma";
import { searchDoctor } from "../services/doctorService";
import { validateSearchQuery } from "../utils/queryValidation";

export const createAppointmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = appointmentSchema.parse(req.body);
    const appointment = await createAppointment(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Appointment created successfully",
      data: appointment,
    });
  },
);

export const getAllAppointmentRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor } = req.query as { cursor?: string };

    const result = await getAllAppointmentsService(cursor);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment records fetched",
      data: result.data,
      pagination: {
        nextCursor: result.pagination.nextCursor || undefined,
        hasMore: result.pagination.hasMore,
      },
    });
  },
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
        new ErrorHandler("Appointment not found", StatusCodes.NOT_FOUND),
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment details fetched",
      data: appointment,
    });
  },
);

export const updateAppointmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = appointmentSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedAppointment = await updateAppointment(id, validatedData);
    if (!updatedAppointment) {
      return next(
        new ErrorHandler("Appointment not found", StatusCodes.NOT_FOUND),
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    });
  },
);

export const cancelAppointmentRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const cancelledAppointment = await cancelAppointment(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment cancelled successfully",
      data: cancelledAppointment,
    });
  },
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
        new ErrorHandler("Appointment not found", StatusCodes.NOT_FOUND),
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment deleted successfully",
      data: deletedAppointment,
    });
  },
);

export const searchAppointmentResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query, cursor } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const result = await searchAppointments(
      searchTerm as string,
      cursor as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: result.data,
      pagination: {
        nextCursor: result.pagination.nextCursor || undefined,
        hasMore: result.pagination.hasMore,
      },
    });
  },
);

export const filterAppointments = catchAsyncError(async (req, res) => {
  const validated = appointmentFilterSchema.parse(req.query);

  const result = await filterAppointmentsService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered appointments fetched",
    data: result.data,
    pagination: {
      nextCursor: result.nextCursor || undefined,
      hasMore: result.hasMore,
    },
  });
});

// Admin endpoint to manually trigger expired appointment update
export const runExpiredAppointmentsUpdate = catchAsyncError(
  async (req: Request, res: Response) => {
    const result = await updateExpiredAppointments();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Expired appointments updated",
      data: {
        updatedCount: result.count,
      },
    });
  },
);
