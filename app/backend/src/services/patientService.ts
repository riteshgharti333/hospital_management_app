import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { createSearchService } from "../utils/searchCache";

export type PatientInput = {
  fullName: string;
  age: number;
  mobileNumber: string;
  gender: string;
  bedNumber: string;
  aadhaarNumber: string;
  address: string;
  medicalHistory: string;
};

export const createPatient = async (data: PatientInput) => {
  return prisma.patient.create({ data });
};

export const getAllPatients = async () => {
  return prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
};

export const getPatientById = async (id: number) => {
  return prisma.patient.findUnique({ where: { id } });
};

// export const getPatientByAadhaar = async (aadhaarNumber: string) => {
//   return prisma.patient.findUnique({ where: { aadhaarNumber } });
// };

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
  return prisma.patient.delete({ where: { id } });
};

const commonSearchFields = ["fullName", "mobileNumber", "aadhaarNumber"];

export const searchPatient = createSearchService(prisma, {
  tableName: "Patient",
  cacheKeyPrefix: "patient",
  ...applyCommonFields(commonSearchFields),
});
