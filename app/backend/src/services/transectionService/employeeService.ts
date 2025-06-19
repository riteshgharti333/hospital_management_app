import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type EmployeeInput = {
  photoUrl?: string;
  employeeName: string;
  fathersName: string;
  dateOfRegistration: Date;
  contactNo: string;
  dateOfBirth: Date;
  email?: string;
  gender: string;
  maritalStatus: string;
  aadharNo?: string;
  voterId?: string;
  bloodGroup?: string;
  department: string;
};

export const createEmployee = async (data: EmployeeInput) => {
  return prisma.employee.create({ data });
};

export const getAllEmployees = async () => {
  return prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getEmployeeById = async (id: number) => {
  return prisma.employee.findUnique({ where: { id } });
};

export const getEmployeeByEmail = async (email: string) => {
  return prisma.employee.findUnique({ where: { email } });
};

export const getEmployeeByAadhar = async (aadharNo: string) => {
  return prisma.employee.findUnique({ where: { aadharNo } });
};

export const getEmployeeByVoterId = async (voterId: string) => {
  return prisma.employee.findUnique({ where: { voterId } });
};

export const getEmployeesByDepartment = async (department: string) => {
  return prisma.employee.findMany({
    where: { department },
    orderBy: { employeeName: "asc" },
  });
};

export const updateEmployee = async (
  id: number,
  data: Partial<EmployeeInput>
) => {
  return prisma.employee.update({
    where: { id },
    data,
  });
};

export const deleteEmployee = async (id: number) => {
  return prisma.employee.delete({ where: { id } });
};
