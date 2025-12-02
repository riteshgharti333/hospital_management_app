import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { filterPaginate } from "../utils/filterPaginate";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";


export type AdmissionInput = {
  admissionDate: Date;
  admissionTime: string;
  dischargeDate?: Date;
  gsRsRegNo: string;
  wardNo: string;
  bedNo: string;
  bloodGroup: string;
  aadhaarNo?: string;
  urnNo: string;
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
      limit: limit || 50,
      cacheExpiry: 600,
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

const commonSearchFields = ["patientName", "gsRsRegNo", "phoneNo"];
 
export const searchAdmissions = createSearchService(prisma, {
  tableName: "Admission",
  cacheKeyPrefix: "admission",
  ...applyCommonFields(commonSearchFields),
});

/// Filter

export const filterAdmissionsService = async (filters: {
  fromDate?: Date;
  toDate?: Date;  
  patientSex?: string;
  bloodGroup?: string;
  cursor?: string | number;
  limit?: number;
}) => {
  const { fromDate, toDate, patientSex, bloodGroup, cursor, limit } = filters;

  // Build filter object
  const filterObj: Record<string, any> = {};

  if (patientSex) filterObj.patientSex = { equals: patientSex, mode: "insensitive" };
  if (bloodGroup) filterObj.bloodGroup = bloodGroup;
  if (fromDate || toDate)
    filterObj.admissionDate = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };

  // Call filterPaginate
  return filterPaginate(prisma, {
    model: "admission",
    cursorField: "id",      
    limit: limit || 50,
    filters: filterObj,
  }, cursor);
};     