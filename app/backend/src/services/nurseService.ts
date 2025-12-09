import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";
import { filterPaginate } from "../utils/filterPaginate";
import { generateRegistrationNumber } from "../utils/registrationGenerator";

export type NurseInput = {
  fullName: string;
  mobileNumber: string;
  department: string;
  address: string;
  shift: string;
  email: string;
  status?: string;
};

export const createNurse = async (data: NurseInput) => {
  const registrationNo = await generateRegistrationNumber(
    prisma.nurse,
    "NUR",
    "registrationNo"
  );

  return prisma.nurse.create({
    data: {
      ...data,
      registrationNo,
    },
  });
};

export const getNurseByEmail = async (email: string) => {
  return prisma.nurse.findUnique({ where: { email } });
};

export const getAllNurses = async (cursor?: string, limit?: number) => {
  return cursorPaginate(
    prisma,
    {
      model: "nurse",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
};

export const getNurseById = async (id: number) => {
  return prisma.nurse.findUnique({ where: { id } });
};

export const getNurseByRegistration = async (registrationNo: string) => {
  return prisma.nurse.findUnique({ where: { registrationNo } });
};

export const updateNurse = async (id: number, data: Partial<NurseInput>) => {
  return prisma.nurse.update({
    where: { id },
    data,
  });
};

export const deleteNurse = async (id: number) => {
  return prisma.nurse.delete({ where: { id } });
};

const commonSearchFields = ["fullName", "mobileNumber", "registrationNo"];

export const searchNurse = createSearchService(prisma, {
  tableName: "Nurse",
  cacheKeyPrefix: "nurse",
  ...applyCommonFields(commonSearchFields),
});

export const filterNursesService = async (filters: {
  fromDate?: Date;
  toDate?: Date;
  shift?: string;
  status?: string;
  cursor?: string | number;
  limit?: number;
}) => {
  const { fromDate, toDate, shift, status, cursor, limit } = filters;

  const filterObj: Record<string, any> = {};

  if (shift) filterObj.shift = { equals: shift, mode: "insensitive" };

  if (status) filterObj.status = { equals: status, mode: "insensitive" };

  if (fromDate || toDate)
    filterObj.createdAt = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };

  return filterPaginate(
    prisma,
    {
      model: "nurse",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};
