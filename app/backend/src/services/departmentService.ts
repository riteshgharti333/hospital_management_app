import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { filterPaginate } from "../utils/filterPaginate";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";

export type DepartmentInput = {
  name: string;
  head: string;
  contactNumber: string;
  email: string;
  location: string;
  description: string;
  status?: string;
};

export const createDepartment = async (data: DepartmentInput) => {
  return prisma.department.create({ data });
};


export const getAllDepartmentService = async (
  cursor?: string,
  limit?: number
) => {
  return cursorPaginate(
    prisma,
    {
      model: "department",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
};

export const getDepartmentById = async (id: number) => {
  return prisma.department.findUnique({ where: { id } });
};

export const getDepartmentByName = async (name: string) => {
  return prisma.department.findUnique({ where: { name } });
};

export const updateDepartment = async (
  id: number,
  data: Partial<DepartmentInput>
) => {
  return prisma.department.update({
    where: { id },
    data,
  });
};

export const deleteDepartment = async (id: number) => {
  return prisma.department.delete({ where: { id } });
};

const commonSearchFields = ["name", "head"];

export const searchDepartment = createSearchService(prisma, {
  tableName: "Department",
  cacheKeyPrefix: "department",
  ...applyCommonFields(commonSearchFields),
});


export const filterDepartmentsService = async (filters: {
  fromDate?: Date;
  toDate?: Date;
  status?: string;
  cursor?: string | number;
  limit?: number;
}) => {
  const { fromDate, toDate, status, cursor, limit } = filters;

  const filterObj: Record<string, any> = {};

  if (status)
    filterObj.status = { equals: status, mode: "insensitive" };

  if (fromDate || toDate)
    filterObj.createdAt = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };

  return filterPaginate(
    prisma,
    {
      model: "department",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};
