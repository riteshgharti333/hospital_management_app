import { prisma } from "../lib/prisma";
import { bumpCacheVersion } from "../utils/cacheVersion";
import { filterPaginate } from "../utils/filterPaginate";
import { cursorPaginate } from "../utils/pagination";
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
  const birth = await prisma.birth.create({ data });
  await bumpCacheVersion("birth");
  return birth;
};

export const getAllBirthService = async (cursor?: string) => {
  return cursorPaginate(prisma, { model: "birth" }, cursor);
};

export const getBirthById = async (id: number) => {
  return prisma.birth.findUnique({ where: { id } });
};

export const updateBirth = async (id: number, data: Partial<BirthInput>) => {
  const birth = await prisma.birth.update({
    where: { id },
    data,
  });
  await bumpCacheVersion("birth");
  return birth;
};

export const deleteBirth = async (id: number) => {
  const birth = await prisma.birth.delete({ where: { id } });
  await bumpCacheVersion("birth");
  return birth;
};

export const searchBirth = createSearchService(prisma, {
  tableName: "birth",
  exactFields: ["fathersName", "mothersName", "mobileNumber"],
  prefixFields: ["fathersName", "mothersName"],
  similarFields: ["fathersName", "mothersName"],
  selectFields: [
    "id",
    "birthTime",
    "birthDate",
    "babySex",
    "babyWeightKg",
    "fathersName",
    "mothersName",
    "mobileNumber",
    "deliveryType",
    "placeOfBirth",
    "attendantsName",
    "createdAt",
  ],
});

type FilterBirthParams = {
  fromDate?: Date;
  toDate?: Date;
  babySex?: string;
  deliveryType?: string;
  cursor?: string;
  limit?: number;
};

export const filterBirthsService = async (params: FilterBirthParams) => {
  const { fromDate, toDate, babySex, deliveryType, cursor } = params;

  const where: Record<string, any> = {};

  if (babySex) {
    where.babySex = {
      equals: babySex,
      mode: "insensitive",
    };
  }

  if (deliveryType) {
    where.deliveryType = {
      equals: deliveryType,
      mode: "insensitive",
    };
  }

  if (fromDate || toDate) {
    where.birthDate = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "birth",
    },
    cursor,
    where,
  );
};