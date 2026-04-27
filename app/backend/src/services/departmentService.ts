import { prisma } from "../lib/prisma";
import { bumpCacheVersion } from "../utils/cacheVersion";
import { filterPaginate } from "../utils/filterPaginate";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";

export type DepartmentInput = {
  name: string; 
  description?: string;
  headId: number;
  status?: "ACTIVE" | "INACTIVE";
};

export const createDepartment = async (data: DepartmentInput) => {
  const department = await prisma.department.create({
    data: {
      ...data,
      status: data.status || "ACTIVE",
    },
  });

  await bumpCacheVersion("department");

  return department;
};

export const getAllDepartments = async (cursor?: string) => {
  return cursorPaginate(prisma, { model: "department" }, cursor);
};

export const getDepartmentById = async (id: number) => {
  return prisma.department.findUnique({
    where: { id },
  });
};

export const updateDepartment = async (
  id: number,
  data: Partial<DepartmentInput>,
) => {
  const department = await prisma.department.update({
    where: { id },
    data,
  });

  await bumpCacheVersion("department");

  return department;
};

export const deleteDepartment = async (id: number) => {
  const department = await prisma.department.delete({ where: { id } });
  await bumpCacheVersion("department");
  return department;
};

const commonSearchFields = [
  "name",
  "description",
];

export const searchDepartment = createSearchService(prisma, {
  tableName: "Department",
  exactFields: ["name"],
  prefixFields: ["name"],
  similarFields: ["name", "description"],
  selectFields: [
    "id",
    "name",
    "description",
    "status",
    "createdAt",
  ],
});

type FilterDepartmentParams = {
  fromDate?: Date;
  toDate?: Date;
  status?: string;
  cursor?: string;
  limit?: number;
};

export const filterDepartmentsService = async (
  params: FilterDepartmentParams
) => {
  const { fromDate, toDate, status, cursor, limit } = params;

  const where: Record<string, any> = {};

  if (status) {
    where.status = {
      equals: status,
      mode: "insensitive",
    };
  }

  if (fromDate || toDate) {
    where.createdAt = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "department",
      limit,
    },
    cursor,
    where
  );
};