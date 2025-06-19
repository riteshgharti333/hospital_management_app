import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export const getAllDepartments = async () => {
  return prisma.department.findMany({ orderBy: { createdAt: "desc" } });
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
