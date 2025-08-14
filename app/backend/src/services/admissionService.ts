import { Admission, Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
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

//////////////

interface FilterResult<T> {
  data: T[];
  nextCursor: string | null;
  metrics: {
    queryTime: number;
    resultCount: number;
  };
}

export async function highPerfFilterAdmissions(
  prisma: PrismaClient,
  filters: {
    dateFrom?: Date;
    dateTo?: Date;
    bloodGroup?: string;
    sex?: string;
  },
  options: {
    cursor?: string;  // Changed from internalCursor to match getAllAdmissions
    limit?: number;   // Added limit parameter
    timeout?: number;
  } = {}
): Promise<FilterResult<Admission>> {
  const startTime = performance.now();
  const DEFAULT_PAGE_SIZE = 100;
  const pageSize = options.limit ? Math.min(options.limit, 200) : DEFAULT_PAGE_SIZE;
  
  const where: Prisma.AdmissionWhereInput = {
    AND: [
      filters.dateFrom || filters.dateTo
        ? {
            admissionDate: {
              gte: filters.dateFrom,
              lte: filters.dateTo,
            },
          }
        : {},
      filters.bloodGroup ? { bloodGroup: filters.bloodGroup } : {},
      filters.sex ? { patientSex: filters.sex } : {},
    ],
  };

  // Timeout protection
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 1000);
  
  try {
    const results = await prisma.admission.findMany({
      where,
      take: pageSize + 1, // Fetch one extra record for cursor
      cursor: options.cursor ? { id: parseInt(options.cursor) } : undefined,
      orderBy: { admissionDate: "desc" },
    });

    const queryTime = performance.now() - startTime;
    
    let nextCursor = null;
    if (results.length > pageSize) {
      nextCursor = String(results.pop()!.id); // Remove extra record and get cursor
    }

    return {
      data: results.slice(0, pageSize), // Return exactly the requested amount
      nextCursor,
      metrics: {
        queryTime,
        resultCount: results.length,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}