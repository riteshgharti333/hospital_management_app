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
  return cursorPaginate(
    prisma,
    {
      model: "department",
     include: {
      head: {
        select: {
          fullName: true  
        }
      }
    }
    },
    cursor,
  );
};

export const getDepartmentById = async (id: number) => {
  return prisma.department.findUnique({
    where: { id },
    include: {
      head: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
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

export const searchDepartment = createSearchService(prisma, {
  tableName: "Department",
  exactFields: ["name"],
  prefixFields: ["name"],
  similarFields: ["name", "description"],
});

type FilterDepartmentParams = {
  fromDate?: Date;
  toDate?: Date;
  status?: string;
  cursor?: string;
  limit?: number;
};

export const filterDepartmentsService = async (
  params: FilterDepartmentParams,
) => {
  const { fromDate, toDate, status, cursor, limit } = params;

  const where: Record<string, any> = {};

  // ✅ Status filter
  if (status) {
    where.status = status.toUpperCase();
  }

  // ✅ Date range filter
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
      // 🔥 Optional optimization
      // select: {
      //   id: true,
      //   fullName: true,
      //   status: true,
      //   createdAt: true,
      // },
    },
    cursor,
    where,
  );
};
