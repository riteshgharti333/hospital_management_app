import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { createSearchService } from "../utils/searchCache";

export type BedInput = {
  bedNumber: string;
  wardNumber: string;
  status?: string;
  description?: string;
};

export const createBed = async (data: BedInput) => {
  return prisma.bed.create({ data });
};

export const getAllBeds = async () => {
  return prisma.bed.findMany({ orderBy: { createdAt: "desc" } });
};

export const getBedById = async (id: number) => {
  return prisma.bed.findUnique({ where: { id } });
};

export const getBedByNumber = async (bedNumber: string) => {
  return prisma.bed.findUnique({ where: { bedNumber } });
};

export const getBedsByWard = async (wardNumber: string) => {
  return prisma.bed.findMany({ where: { wardNumber } });
};

export const updateBed = async (id: number, data: Partial<BedInput>) => {
  return prisma.bed.update({
    where: { id },
    data,
  });
};

export const deleteBed = async (id: number) => {
  return prisma.bed.delete({ where: { id } });
};

const commonSearchFields = ["bedNumber", "wardNumber"];

export const searchBed = createSearchService(prisma, {
  tableName: "Bed",
  cacheKeyPrefix: "bed",
  ...applyCommonFields(commonSearchFields),
});
