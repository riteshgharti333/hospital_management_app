import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type BirthInput = {
  birthTime: string;
  birthDate: Date;
  babySex: string;
  babyWeightKg: number;
  fathersName: string;
  mothersName: string;
  mobileNumber: string;
  deliveryType: string;
  placeOfBirth: string;
  attendantsName: string;
};

export const createBirth = async (data: BirthInput) => {
  return prisma.birth.create({ data });
};

export const getAllBirths = async () => {
  return prisma.birth.findMany({ orderBy: { createdAt: "desc" } });
};

export const getBirthById = async (id: number) => {
  return prisma.birth.findUnique({ where: { id } });
};

export const updateBirth = async (id: number, data: Partial<BirthInput>) => {
  return prisma.birth.update({
    where: { id },
    data,
  });
};

export const deleteBirth = async (id: number) => {
  return prisma.birth.delete({ where: { id } });
};
