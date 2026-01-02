import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { filterPaginate } from "../utils/filterPaginate";
import { generateHospitalId } from "../utils/generateHospitalId";
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

  return prisma.patient.create({
    data: {
      ...data,
      hospitalPatientId,
    },
  });
};

export const getAllPatients = async () => {
  return prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
  });
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
  return prisma.patient.update({
    where: { id },
    data,
  });
};

export const deletePatient = async (id: number) => {
  return prisma.patient.delete({
    where: { id },
  });
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
