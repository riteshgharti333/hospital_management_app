import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProfile = async (data: { name: string; email: string; password: string }) => {
  return prisma.profile.create({ data });
};

export const findProfileByEmail = async (email: string) => {
  return prisma.profile.findUnique({ where: { email } });
};
