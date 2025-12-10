import { prisma } from "../lib/prisma";

export type CreateUserInput = {
  regId: string;
  name: string;
  email: string;
  role: "DOCTOR" | "NURSE"; // 👈 now supports both
  password: string;
};

export const createUserLogin = async (data: CreateUserInput) => {
  return prisma.user.create({ data });
};

export const getUserByRegId = async (regId: string) => {
  return prisma.user.findUnique({ where: { regId } });
};
