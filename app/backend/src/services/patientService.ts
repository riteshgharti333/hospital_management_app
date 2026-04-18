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

export const getAllPatients = async (cursor?: string) => {
  return cursorPaginate(prisma, { model: "patient" }, cursor);
};

export const getPatientById = async (id: number) => {
  return prisma.patient.findUnique({
    where: { id },
  });
};

export const updatePatient = async (
  id: number,
  data: Partial<PatientInput>,
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
  exactFields: ["fullName", "mobileNumber", "aadhaarNumber", "hospitalPatientId"],
  prefixFields: ["fullName"],
  similarFields: ["fullName", "address"],
  selectFields: [
    "id",
    "hospitalPatientId",
    "fullName",
    // "dateOfBirth",
    "gender",
    "mobileNumber",
    "aadhaarNumber",
    "createdAt",
  ],
});


type FilterPatientParams = {
  fromDate?: Date;
  toDate?: Date;
  gender?: string;
  cursor?: string;
  limit?: number;
};

export const filterPatientsService = async (
  params: FilterPatientParams
) => {
  const { fromDate, toDate, gender, cursor, limit } = params;

  const where: Record<string, any> = {};

  if (gender) {
    where.gender = {
      equals: gender,
      mode: "insensitive",
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
      model: "patient",
      limit,
    },
    cursor,
    where
  );
};