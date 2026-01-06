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
      status: "ADMITTED",
    },
  });
};

export const findActiveAdmissionByPatient = async (patientId: number) => {
  return prisma.admission.findFirst({
    where: {
      patientId,
      status: "ADMITTED",
    },
  });
};

export const getAllAdmissionsService = async (
  cursor?: string,
  limit?: number
) => {
  return cursorPaginate(
    prisma,
    {
      model: "admission",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,

      select: {
        id: true,
        hospitalAdmissionId: true,
        admissionDate: true,
        dischargeDate: true,
    

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
    cursor ? Number(cursor) : undefined
  );
};



export const getAdmissionById = async (id: number) => {
  return prisma.admission.findUnique({ where: { id } });
};

export const updateAdmission = async (
  id: number,
  data: Partial<AdmissionInput>
) => {
  return prisma.admission.update({
    where: { id },
    data,
  });
};

export const deleteAdmission = async (id: number) => {
  return prisma.admission.delete({ where: { id } });
};

const commonSearchFields = ["hospitalAdmissionId"];

export const searchAdmissions = createSearchService(prisma, {
  tableName: "Admission",
  cacheKeyPrefix: "admission",
  ...applyCommonFields(commonSearchFields),
});

/// Filter

export const filterAdmissionsService = async (filters: {
  fromDate?: Date;
  toDate?: Date;
  gender?: string;
  cursor?: string | number;
  limit?: number;
}) => {
  const { fromDate, toDate, gender, cursor, limit } = filters;

  // Build filter object
  const filterObj: Record<string, any> = {};

  if (gender)
    filterObj.gender = { equals: gender, mode: "insensitive" };
  if (fromDate || toDate)
    filterObj.admissionDate = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };

  // Call filterPaginate
  return filterPaginate(
    prisma,
    {
      model: "admission",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};
