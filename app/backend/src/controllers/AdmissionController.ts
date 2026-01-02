import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  filterAdmissionsService,
  getAllAdmissionsService,
  searchAdmissions,
  findActiveAdmissionByPatient,
  createAdmissionService,
} from "../services/admissionService";

import {filterPatientsService} from "../services/patientService";

const prisma = new PrismaClient();

import { admissionFilterSchema, admissionSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../utils/queryValidation";
import { searchPatient } from "../services/patientService";

// CREATE

export const createAdmission = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1️⃣ Validate body
    const validated = admissionSchema.parse(req.body);

    // 2️⃣ Business rule (controller responsibility)
    const activeAdmission = await findActiveAdmissionByPatient(
      validated.patientId
    );

    // if (activeAdmission) {
    //   return sendResponse(res, {
    //     success: false,
    //     statusCode: StatusCodes.BAD_REQUEST,
    //     message: "Patient already has an active admission",
    //   });
    // }

    // 3️⃣ Create admission (DB + ID handled in service)
    const admission = await createAdmissionService(validated);

    // 4️⃣ Send response
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Admission created successfully",
      data: admission,
    });
  }
);

// GET ALL

export const getAllAdmissions = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor, limit } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const { data: admission, nextCursor } = await getAllAdmissionsService(
      cursor,
      limit ? Number(limit) : undefined
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission records fetched",
      data: admission,
      pagination: {
        nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
        limit: limit ? Number(limit) : 50,
      },
    });
  }
);

// GET SINGLE BY ID
export const getAdmissionById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const admission = await prisma.admission.findUnique({ where: { id } });
    if (!admission)
      return next(
        new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND)
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission details fetched",
      data: admission,
    });
  }
);

// UPDATE
export const updateAdmission = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    // Allow partial update
    const partialSchema = admissionSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedAdmission = await prisma.admission.update({
      where: { id },
      data: validatedData,
    });

    if (!updatedAdmission)
      return next(
        new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND)
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission updated successfully",
      data: updatedAdmission,
    });
  }
);

// DELETE
export const deleteAdmission = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id))
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));

    const deletedAdmission = await prisma.admission.delete({ where: { id } });
    if (!deletedAdmission)
      return next(
        new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND)
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission deleted successfully",
      data: deletedAdmission,
    });
  }
);

//////////// SEARCH ADMISSIONS

export const searchAdmissionsResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;
    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    // 1️⃣ Direct admission search (admissionId etc.)
    const admissionsDirect = await searchAdmissions(searchTerm);

    // 2️⃣ Patient search
    const patients = await searchPatient(searchTerm);
    const patientIds = patients.map((p) => p.id);

    // 3️⃣ Admissions via patients
    const admissionsViaPatients = patientIds.length
      ? await prisma.admission.findMany({
          where: {
            patientId: { in: patientIds },
          },
          include: {
            patient: {
              select: {
                hospitalPatientId: true,
                fullName: true,
                gender: true,
                mobileNumber: true,
                aadhaarNumber: true,
              },
            },
            doctor: {
              select: {
                fullName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

    // 4️⃣ Merge + deduplicate by admission.id
    const mergedMap = new Map<number, any>();

    admissionsDirect.forEach((a: any) => mergedMap.set(a.id, a));
    admissionsViaPatients.forEach((a: any) => mergedMap.set(a.id, a));

    const mergedResults = Array.from(mergedMap.values());

    // 5️⃣ Send response
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission search results fetched successfully",
      data: mergedResults,
    });
  }
);

///////////

export const filterAdmissions = catchAsyncError(async (req, res, next) => {
  const validated = admissionFilterSchema.parse(req.query);

  const {
    fromDate,
    toDate,
    gender,
    cursor,
    limit,
  } = validated;

  let admissions: any[] = [];

  // 🟢 CASE 1: gender filter exists
  if (gender) {
    // 1️⃣ Filter patients by gender
    const { data: patients } = await filterPatientsService({ gender });
    const patientIds = patients.map((p) => p.id);

    if (patientIds.length === 0) {
      return sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Filtered admissions fetched",
        data: [],
        pagination: { limit: limit || 50 },
      });
    }

    // 2️⃣ Fetch admissions by patientIds + optional date
    admissions = await prisma.admission.findMany({
      where: {
        patientId: { in: patientIds },
        ...(fromDate || toDate
          ? {
              admissionDate: {
                gte: fromDate,
                lte: toDate,
              },
            }
          : {}),
      },
      include: {
        patient: {
          select: {
            hospitalPatientId: true,
            fullName: true,
            gender: true,
            mobileNumber: true, 
            aadhaarNumber:true
          },
        },
        doctor: {       
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit || 50,
    });
  }

  // 🟢 CASE 2: NO gender filter → admission-only filter
  else {
    const { data } = await filterAdmissionsService({
      fromDate,
      toDate,
      cursor,
      limit,
    });

    admissions = data;
  }

  // 3️⃣ Send response
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered admissions fetched",
    data: admissions,
    pagination: {
      limit: limit || 50,
    },
  });
});
