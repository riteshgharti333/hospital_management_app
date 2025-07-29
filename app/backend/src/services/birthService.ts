import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { createSearchService } from "../utils/searchCache";

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

const commonSearchFields = ["fathersName", "mothersName"];

export const searchBirth = createSearchService(prisma, {
  tableName: "Birth",
  cacheKeyPrefix: "birth",
  ...applyCommonFields(commonSearchFields),
});
