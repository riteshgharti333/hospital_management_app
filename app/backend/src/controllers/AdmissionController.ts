import { Request, Response, NextFunction } from "express";
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

import { admissionFilterSchema, admissionSchema } from "@hospital/schemas";
import { validateSearchQuery } from "../utils/queryValidation";
import { searchPatient } from "../services/patientService";
import { prisma } from "../lib/prisma";
import { PAGINATION_CONFIG } from "../lib/paginationConfig";

// CREATE

export const createAdmission = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1️⃣ Validate body
    const validated = admissionSchema.parse(req.body);

    // 2️⃣ Business rule (controller responsibility)
    const activeAdmission = await findActiveAdmissionByPatient(
      validated.patientId,
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
  },
);

// GET ALL

export const getAllAdmissions = catchAsyncError(
  async (req: Request, res: Response) => {
    const { cursor } = req.query as { cursor?: string };

    const result = await getAllAdmissionsService(cursor);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission records fetched",
      data: result.data,
      pagination: {
        nextCursor: result.pagination.nextCursor || undefined,
        hasMore: result.pagination.hasMore,
      },
    });
  },
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
        new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND),
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission details fetched",
      data: admission,
    });
  },
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
        new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND),
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission updated successfully",
      data: updatedAdmission,
    });
  },
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
        new ErrorHandler("Admission not found", StatusCodes.NOT_FOUND),
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission deleted successfully",
      data: deletedAdmission,
    });
  },
);

//////////// SEARCH ADMISSIONS

export const searchAdmissionsResults = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;
    const searchTerm = validateSearchQuery(query, next);
    if (!searchTerm) return;

    // 1️⃣ Direct admission search (admissionId etc.)
    const admissionsDirect = await searchAdmissions(searchTerm);

    // Enrich direct admissions with patient and doctor data
    const enrichedDirectAdmissions = await Promise.all(
      admissionsDirect.map(async (admission: any) => {
        const [patient, doctor] = await Promise.all([
          prisma.patient.findUnique({
            where: { id: admission.patientId },
            select: { 
              id: true,
              fullName: true,
              gender: true,
              mobileNumber: true,
              aadhaarNumber: true,
              hospitalPatientId: true,
              address:true
            }, 
          }),
          prisma.doctor.findUnique({
            where: { id: admission.doctorId },
            select: {
              id: true,
              fullName: true,
              specialization: true,
              mobileNumber: true,
            },
          }),
        ]);

        return { ...admission, patient, doctor };
      }),
    );

    // 2️⃣ Patient search
    const patients = await searchPatient(searchTerm);
    const patientIds = patients.map((p) => p.id);

    // 3️⃣ Admissions via patients (already has include)
    const admissionsViaPatients = patientIds.length
      ? await prisma.admission.findMany({
          where: {
            patientId: { in: patientIds },
          },
          include: {
            patient: {
              select: {
                id: true,
                hospitalPatientId: true,
                fullName: true,
                gender: true,
                mobileNumber: true,
                aadhaarNumber: true,
              },
            },
            doctor: {
              select: {
                id: true,
                fullName: true,
                specialization: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

    // 4️⃣ Merge + deduplicate by admission.id
    const mergedMap = new Map<number, any>();

    enrichedDirectAdmissions.forEach((a: any) => mergedMap.set(a.id, a));
    admissionsViaPatients.forEach((a: any) => mergedMap.set(a.id, a));

    const mergedResults = Array.from(mergedMap.values());

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admission search results fetched successfully",
      data: mergedResults,
    });
  },
);

/////////// FILTER ADMISSIONS

export const filterAdmissions = catchAsyncError(async (req, res) => {
  const validated = admissionFilterSchema.parse(req.query);

  const { data, nextCursor, hasMore } =
    await filterAdmissionsService(validated);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered admissions fetched",
    data,
    pagination: {
      nextCursor: nextCursor || undefined,
      limit: validated.limit ?? PAGINATION_CONFIG.DEFAULT_LIMIT,
      hasMore,
    },
  });
});
