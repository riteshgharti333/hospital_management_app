import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { cursorPaginate } from "../utils/pagination";
import { filterPaginate } from "../utils/filterPaginate";
import { createSearchService } from "../utils/searchCache";
import { generateRegistrationNumber } from "../utils/registrationGenerator";

export type DoctorInput = {
  fullName: string;
  mobileNumber: string;
  email: string;
  qualification: string;
  designation: string;
  department: string;
  specialization: string;
  status?: string;
};

export const createDoctor = async (data: DoctorInput) => {
  // Auto-generate registration number
  const registrationNo = await generateRegistrationNumber(
    prisma.doctor,
    "DOC",
    "registrationNo"
  );

  return prisma.doctor.create({
    data: {
      ...data,
      registrationNo,
    },
  });
};

export const getDoctorByEmail = async (email: string) => {
  return prisma.doctor.findUnique({ where: { email } });
};


export const getAllDoctors = async (cursor?: string, limit?: number) => {
  return cursorPaginate(
    prisma,
    {
      model: "doctor",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
};

export const getDoctorById = async (id: number) => {
  return prisma.doctor.findUnique({ where: { id } });
};

export const getDoctorByRegistration = async (registrationNo: string) => {
  return prisma.doctor.findUnique({ where: { registrationNo } });
};

export const getDoctorsByDepartment = async (department: string) => {
  return prisma.doctor.findMany({
    where: { department },
    orderBy: { fullName: "asc" },
  });
};

export const updateDoctor = async (id: number, data: Partial<DoctorInput>) => {
  return prisma.doctor.update({ where: { id }, data });
};

export const deleteDoctor = async (id: number) => {
  return prisma.doctor.delete({ where: { id } });
};

const commonSearchFields = ["fullName", "mobileNumber", "registrationNo"];

export const searchDoctor = createSearchService(prisma, {
  tableName: "Doctor",
  cacheKeyPrefix: "doctor",
  ...applyCommonFields(commonSearchFields),
});

export const filterDoctorsService = async (filters: {
  fromDate?: Date;
  toDate?: Date;
  status?: string;
  cursor?: string | number;
  limit?: number;
}) => {
  const { fromDate, toDate, status, cursor, limit } = filters;

  const filterObj: Record<string, any> = {};

  if (status) filterObj.status = { equals: status, mode: "insensitive" };

  if (fromDate || toDate)
    filterObj.createdAt = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };

  return filterPaginate(
    prisma,
    {
      model: "doctor",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};
