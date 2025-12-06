import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { filterPaginate } from "../utils/filterPaginate";
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

  if (fromDate || toDate)
    filterObj.createdAt = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };

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


export const getPatientAnalytics = async () => {
  const now = new Date();

  // ============= TIME RANGES =============

  // Last 3 Months
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  // Last 6 Months
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  // Last 1 Year
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  // Current Month
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Previous Month
  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Helper function to count patients in a date range
  const countPatients = async (from?: Date, to?: Date) => {
    const where: any = {};
    if (from || to) {
      where.createdAt = {
        gte: from,
        lte: to || now,
      };
    }
    return prisma.patient.count({ where });
  };

  // % logic
  const percent = (curr: number, prev: number) => {
    if (!prev) return 0;
    return Number((((curr - prev) / prev) * 100).toFixed(2));
  };

  // Compute values
  const currentMonth = await countPatients(currentMonthStart);
  const previousMonth = await countPatients(
    previousMonthStart,
    previousMonthEnd
  );

  return {
    total: await prisma.patient.count(),

    // Updated ranges
    threeMonths: await countPatients(threeMonthsAgo),
    sixMonths: await countPatients(sixMonthsAgo),
    oneYear: await countPatients(oneYearAgo),

    currentMonth,
    previousMonth,

    percentChange: percent(currentMonth, previousMonth),
  };
};



export const getPatientAgeDistribution = async () => {
  // Fetch only required fields for speed
  const patients = await prisma.patient.findMany({
    select: { age: true }
  });

  const groups = {
    "0-10": 0,
    "11-20": 0,
    "21-30": 0,
    "31-40": 0,
    "41-50": 0,
    "51-60": 0,
    "61-70": 0,
    "71+": 0
  };

  let totalAge = 0;

  patients.forEach((p) => {
    totalAge += p.age;

    if (p.age <= 10) groups["0-10"]++;
    else if (p.age <= 20) groups["11-20"]++;
    else if (p.age <= 30) groups["21-30"]++;
    else if (p.age <= 40) groups["31-40"]++;
    else if (p.age <= 50) groups["41-50"]++;
    else if (p.age <= 60) groups["51-60"]++;
    else if (p.age <= 70) groups["61-70"]++;
    else groups["71+"]++;
  });

  const averageAge =
    patients.length === 0
      ? 0
      : Number((totalAge / patients.length).toFixed(1));

  // determine which age group is the mode (highest count)
  let modeGroup = "";
  let highest = 0;

  for (const [key, value] of Object.entries(groups)) {
    if (value > highest) {
      highest = value;
      modeGroup = key;
    }
  }

  return {
    groups,          // counts for chart
    averageAge,      // bottom text
    modeGroup,       // “Most: 31–40 yrs”
    modeCount: highest
  };
};
