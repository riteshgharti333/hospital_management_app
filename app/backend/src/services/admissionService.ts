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




export const getMonthlyAdmissionTrend = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Create 12 months empty counters
  const monthlyCounts = Array(12).fill(0);

  // Fetch all current year admissions
  const admissions = await prisma.admission.findMany({
    where: {
      admissionDate: {
        gte: new Date(currentYear, 0, 1),
        lte: now,
      },
    },
    select: { admissionDate: true },
  });

  // Fill monthly counts
  admissions.forEach((record) => {
    const monthIndex = new Date(record.admissionDate).getMonth();
    monthlyCounts[monthIndex] += 1;
  });

  // Trim future months
  const trimmedCounts = monthlyCounts.slice(0, now.getMonth() + 1);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ].slice(0, trimmedCounts.length);

  // ----------------------------
  //  SIX-MONTH GROWTH CALCULATION
  // ----------------------------

  const currentStart = new Date(now);
  currentStart.setMonth(now.getMonth() - 5);

  const prevStart = new Date(now);
  prevStart.setMonth(now.getMonth() - 11);

  const prevEnd = new Date(now);
  prevEnd.setMonth(now.getMonth() - 6);

  const countAdmissions = async (from: Date, to: Date) => {
    return prisma.admission.count({
      where: {
        admissionDate: { gte: from, lte: to },
      },
    });
  };

  const current6 = await countAdmissions(currentStart, now);
  const previous6 = await countAdmissions(prevStart, prevEnd);

  const percentChange =
    previous6 === 0
      ? 0
      : Number((((current6 - previous6) / previous6) * 100).toFixed(2));

  return {
    months,
    counts: trimmedCounts,

    growth: {
      currentSixMonths: current6,
      previousSixMonths: previous6,
      percentChange,
    },
  };
};


export const getAdmissionGenderAnalytics = async () => {
  // Count for all time admissions
  const totalAdmissions = await prisma.admission.count();

  // Count by gender
  const maleCount = await prisma.admission.count({
    where: { patientSex: "Male" },
  });

  const femaleCount = await prisma.admission.count({
    where: { patientSex: "Female" },
  });

  const otherCount = await prisma.admission.count({
    where: { patientSex: "Other" },
  });

  // Avoid division by zero
  const percent = (part: number) =>
    totalAdmissions === 0
      ? 0
      : Number(((part / totalAdmissions) * 100).toFixed(2));

  return {
    totalAdmissions,
    male: {
      count: maleCount,
      percentage: percent(maleCount),
    },
    female: {
      count: femaleCount,
      percentage: percent(femaleCount),
    },
    other: {
      count: otherCount,
      percentage: percent(otherCount),
    },
  };
};



export const getAdmissionAnalytics = async () => {
  const now = new Date();

  // --- TIME RANGES ---
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  // --- CURRENT MONTH RANGE ---
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // --- PREVIOUS MONTH RANGE ---
  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Count admissions by date range
  const countAdmissions = async (from?: Date, to?: Date) => {
    const where: any = {};
    if (from || to) {
      where.admissionDate = {
        gte: from,
        lte: to || now,
      };
    }
    return prisma.admission.count({ where });
  };

  const percent = (curr: number, prev: number) => {
    if (!prev) return 0;
    return Number((((curr - prev) / prev) * 100).toFixed(2));
  };

  const total = await prisma.admission.count();

  const currentMonth = await countAdmissions(currentMonthStart);
  const previousMonth = await countAdmissions(
    previousMonthStart,
    previousMonthEnd
  );

  return {
    total,

    threeMonths: await countAdmissions(threeMonthsAgo),
    sixMonths: await countAdmissions(sixMonthsAgo),
    oneYear: await countAdmissions(oneYearAgo),

    currentMonth,
    previousMonth,

    percentChange: percent(currentMonth, previousMonth),
  };
};

