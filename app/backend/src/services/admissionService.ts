import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";
import { AdmissionFilterInput } from "@hospital/schemas";

export type AdmissionInput = {
  admissionDate: Date;
  admissionTime: string;
  dischargeDate?: Date;
  gsRsRegNo: string;
  wardNo: string;
  bedNo: string;
  bloodGroup: string;
  aadhaarNo: string;
  urnNo?: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  guardianType: string;
  guardianName: string;
  phoneNo: string;
  patientAddress: string;
  bodyWeightKg: number;
  bodyHeightCm: number;
  literacy: string;
  occupation: string;
  doctorName: string;
  isDelivery?: boolean;
};

export const createAdmission = async (data: AdmissionInput) => {
  return prisma.admission.create({ data });
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
      limit: limit || 100,
      cacheExpiry: 600,
    },
    cursor
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

const commonSearchFields = ["patientName", "gsRsRegNo", "aadhaarNo"];

export const searchAdmissions = createSearchService(prisma, {
  tableName: "Admission",
  cacheKeyPrefix: "admission",
  ...applyCommonFields(commonSearchFields),
});


///


export const filterAdmissionsService = async (filters: AdmissionFilterInput) => {
  const { fromDate, toDate, patientSex, bloodGroup, cursor, limit } = filters;

  const where: any = {};
  if (fromDate || toDate) {
    where.admissionDate = {};
    if (fromDate) where.admissionDate.gte = new Date(fromDate);
    if (toDate) where.admissionDate.lte = new Date(toDate);
  }
  if (patientSex) where.patientSex = patientSex;
  if (bloodGroup) where.bloodGroup = bloodGroup;

  return cursorPaginate(
    prisma,
    {
      model: "admission",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 60,
    },
    cursor,
    where // ✅ pass only for this filter
  );
};
