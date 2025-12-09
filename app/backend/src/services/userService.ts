import { prisma } from "../lib/prisma";

export type CreateDoctorUserInput = {
  regId: string;    // DOC-123
  name: string;     // Doctor name from doctor table
  email: string;    // Doctor email from doctor table
  role: "DOCTOR";   // fixed
  password: string; // hashed
};

export const createDoctorUser = async (data: CreateDoctorUserInput) => {
  return prisma.user.create({ data });
};

export const getUserByRegId = async (regId: string) => {
  return prisma.user.findUnique({ where: { regId } });
};
