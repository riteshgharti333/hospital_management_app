import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { filterPaginate } from "../utils/filterPaginate";
import { generateHospitalId } from "../utils/generateHospitalId";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";

export type AdmissionInput = {
  patientId: number;
  doctorId: number;
  admissionDate: Date;
  dischargeDate?: Date;
};

export const createAdmissionService = async (data: AdmissionInput) => {
  const hospitalAdmissionId = await generateHospitalId({
    prefix: "ADM",
    model: "admission",
    field: "hospitalAdmissionId",
  });

  return prisma.admission.create({
    data: {
      ...data,
      hospitalAdmissionId,
      // status: "ADMITTED", // ❌ REMOVED
    },
  });
};

export const findActiveAdmissionByPatient = async (patientId: number) => {
  return prisma.admission.findFirst({
    where: {
      patientId,
      // status: "ADMITTED", // ❌ REMOVED
    },
  });
};

export const getAllAdmissionsService = async (
  cursor?: string,
  limit?: number,
) => {
  return cursorPaginate(
    prisma,
    {
      model: "admission",
      limit: limit || 50,
      cacheExpiry: 600,

      // ⚠️ IMPORTANT: must match pagination order
      // (your cursorPaginate uses createdAt + id)

      select: {
        id: true,
        hospitalAdmissionId: true,
        admissionDate: true,
        dischargeDate: true,
        createdAt: true, 

        patient: {
          select: {
            id: true,
            fullName: true,
            gender: true,
            mobileNumber: true,
            aadhaarNumber: true,
            address: true,
          },
        },

        doctor: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    },
    cursor, // ✅ string cursor (createdAt|id)
  );
};

export const getAdmissionById = async (id: number) => {
  return prisma.admission.findUnique({ where: { id } });
};

export const updateAdmission = async (
  id: number,
  data: Partial<AdmissionInput>,
) => {
  return prisma.admission.update({
    where: { id },
    data,
  });
};

export const deleteAdmission = async (id: number) => {
  return prisma.admission.delete({ where: { id } });
};

export const searchAdmissions = createSearchService(prisma, {
  tableName: "Admission",
  exactFields: ["hospitalAdmissionId"],
  prefixFields: [],
  similarFields: [],
});

/// Filter

type FilterAdmissionParams = {
  fromDate?: Date;
  toDate?: Date;
  gender?: string;
  cursor?: string;
  limit?: number;
};

export const filterAdmissionsService = async (
  params: FilterAdmissionParams,
) => {
  const { fromDate, toDate, gender, cursor, limit } = params;

  const where: Record<string, any> = {};

  if (gender) {
    where.patient = {
      gender: {
        equals: gender,
        mode: "insensitive",
      },
    };
  }

  if (fromDate || toDate) {
    where.createdAt = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "admission",
      limit,
      include: {
        patient: {
          select: {
            id: true,
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
          },
        },
      },
    },
    cursor,
    where,
  );
};