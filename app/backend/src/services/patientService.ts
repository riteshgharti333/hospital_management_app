import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { bumpCacheVersion } from "../utils/cacheVersion";
import { filterPaginate } from "../utils/filterPaginate";
import { generateHospitalId } from "../utils/generateHospitalId";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";

export type PatientInput = {
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  mobileNumber?: string;
  aadhaarNumber?: string;
  address: string;
};

export const createPatient = async (data: PatientInput) => {
  const hospitalPatientId = await generateHospitalId({
    prefix: "PAT",
    model: "patient",
    field: "hospitalPatientId",
  });

  const patient = await prisma.patient.create({
    data: {
      ...data,
      hospitalPatientId,
    },
  });

  await bumpCacheVersion("patient");

  return patient;
};

export const getAllPatients = async (cursor?: string, limit?: number) => {
  return cursorPaginate(
    prisma,
    {
      model: "patient",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
};

export const getPatientById = async (id: number) => {
  return prisma.patient.findUnique({
    where: { id },
  });
};

export const updatePatient = async (
  id: number,
  data: Partial<PatientInput>
) => {
  const patient = await prisma.patient.update({
    where: { id },
    data,
  });

  await bumpCacheVersion("patient");

  return patient;
};



export const deletePatient = async (id: number) => {
  const patient = await prisma.patient.delete({ where: { id } });
  await bumpCacheVersion("patient");
  return patient;
};


const commonSearchFields = [
  "fullName",
  "mobileNumber",
  "aadhaarNumber",
  "hospitalPatientId",
];

export const searchPatient = createSearchService(prisma, {
  tableName: "Patient",
  cacheKeyPrefix: "patient",
  ...applyCommonFields(commonSearchFields),
});

export const filterPatientsService = async (filters: {
  fromDate?: Date;
  toDate?: Date;
  gender?: string;
  cursor?: string | number;
  limit?: number;
}) => {
  const { fromDate, toDate, gender, cursor, limit } = filters;

  const filterObj: Record<string, any> = {};

  if (gender) filterObj.gender = { equals: gender, mode: "insensitive" };

  if (fromDate || toDate) {
    filterObj.createdAt = {
      gte: fromDate,
      lte: toDate,
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "patient",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};
