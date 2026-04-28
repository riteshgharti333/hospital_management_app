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
  async (req, res, next) => {
    const { query } = req.query;

    const searchTerm = typeof query === "string" ? query : null;
    if (!searchTerm) {
      return sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "No search query provided",
        data: [],
      });
    }

    // 1️⃣ Direct appointment search
    const appointmentsDirect = await searchAppointments(searchTerm);

    // 2️⃣ Collect doctorIds
    const doctorIds = [
      ...new Set(appointmentsDirect.map((a: any) => a.doctorId)),
    ];

    // 3️⃣ Fetch doctors (batch)
    const doctors = doctorIds.length
      ? await prisma.doctor.findMany({
          where: { id: { in: doctorIds } },
          select: {
            id: true,
            fullName: true,
          },
        })
      : [];

    const doctorMap = new Map(doctors.map((d) => [d.id, d]));

    // 4️⃣ Enrich direct results
    const enrichedDirect = appointmentsDirect.map((a: any) => ({
      ...a,
      doctor: doctorMap.get(a.doctorId) || null,
    }));

    // 5️⃣ Search doctors by name (THIS is key part)
    const matchedDoctors = await searchDoctor(searchTerm);
    const matchedDoctorIds = matchedDoctors.map((d: any) => d.id);

    // 6️⃣ Appointments via doctor name
    const appointmentsViaDoctors = matchedDoctorIds.length
      ? await prisma.appointment.findMany({
          where: {
            doctorId: { in: matchedDoctorIds },
          },
          include: { 
            doctor: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

    // 7️⃣ Merge + dedupe
    const mergedMap = new Map();

    enrichedDirect.forEach((a: any) => mergedMap.set(a.id, a));
    appointmentsViaDoctors.forEach((a: any) => mergedMap.set(a.id, a));

    const mergedResults = Array.from(mergedMap.values());

    // 8️⃣ Response
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: mergedResults,
    });
  }
);

export const filterAppointments = catchAsyncError(async (req, res) => {
  const validated = appointmentFilterSchema.parse(req.query);

  const { data, nextCursor, hasMore } =
    await filterAppointmentsService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered appointments fetched",
    data,
    pagination: {
      nextCursor: nextCursor || undefined,
      limit: validated.limit ?? PAGINATION_CONFIG.DEFAULT_LIMIT,
      hasMore,
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

