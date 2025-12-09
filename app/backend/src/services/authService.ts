import { prisma } from "../lib/prisma";

export const findUserByRegId = async (regId: string) => {
  return prisma.user.findUnique({
    where: { regId },
  });
};

export const createUser = async (data: any) => {
  return prisma.user.create({ data });
};

export const updateUserPassword = async (id: string, hashedPassword: string) => {
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword, mustChangePassword: false },
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};
