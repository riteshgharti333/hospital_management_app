import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  searchDoctor,
  filterDoctorsService,
  getDoctorByEmail,
} from "../services/doctorService";
import { doctorSchema, doctorFilterSchema } from "@hospital/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { validateSearchQuery } from "../utils/queryValidation";

export const createDoctorRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = doctorSchema.parse(req.body);

    const existingDoctor = await getDoctorByEmail(validated.email);
    if (existingDoctor) {
      return next(
        new ErrorHandler(
          "Doctor with this email already exists",
          StatusCodes.CONFLICT
        )
      );
    }

    const doctor = await createDoctor(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Doctor created successfully",
      data: doctor,
    });
  }
);

export const getAllDoctorRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor, limit } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const { data: doctor, nextCursor } = await getAllDoctors(
      cursor,
      limit ? Number(limit) : undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor records fetched",
      data: doctor,
      pagination: {
        nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
        limit: limit ? Number(limit) : 50,
      },
    });
  }
);

export const getDoctorRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const doctor = await getDoctorById(id);
    if (!doctor) {
      return next(new ErrorHandler("Doctor not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor details fetched",
      data: doctor,
    });
  }
);

export const updateDoctorRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(
        new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST)
      );
    }

    const partialSchema = doctorSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    // 🔍 Email uniqueness check (Doctor table)
    if (validatedData.email) {
      const existingDoctor = await getDoctorByEmail(validatedData.email);

      if (existingDoctor && existingDoctor.id !== id) {
        return next(
          new ErrorHandler(
            "Another doctor with this email already exists",
            StatusCodes.CONFLICT
          )
        );
      }
    }

    const updatedDoctor = await updateDoctor(id, validatedData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  }
);


export const deleteDoctorRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(
        new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST)
      );
    }

    try {
      const deletedDoctor = await deleteDoctor(id);

      if (!deletedDoctor) {
        return next(
          new ErrorHandler("Doctor not found", StatusCodes.NOT_FOUND)
        );
      }

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Doctor and access deleted successfully",
        data: deletedDoctor,
      });
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        return next(
          new ErrorHandler(
            "Cannot delete doctor: Prescriptions or admissions linked to this doctor exist.",
            StatusCodes.CONFLICT
          )
        );
      }

      return next(
        new ErrorHandler(
          "An error occurred while deleting doctor",
          StatusCodes.INTERNAL_ERROR
        )
      );
    }
  }
);



export const searchDoctorResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    const doctors = await searchDoctor(searchTerm);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Search results fetched successfully",
      data: doctors,
    });
  }
);

export const filterDoctors = catchAsyncError(async (req, res) => {
  const validated = doctorFilterSchema.parse(req.query);

  const { data, nextCursor } = await filterDoctorsService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered doctors fetched",
    data,
    pagination: {
      nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
      limit: validated.limit || 50,
    },
  });
});
