import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";

export type NurseInput = {
  fullName: string;
  mobileNumber: string;
  registrationNo: string;
  department: string;
  address: string;
  shift: string;
  status?: string;
};

export const createNurse = async (data: NurseInput) => {
  return prisma.nurse.create({ data });
};

export const getAllNurses = async (
  cursor?: string,
  limit?: number
) => {
  return cursorPaginate(
    prisma,
    {
      model: "nurse",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
};

export const getNurseById = async (id: number) => {
  return prisma.nurse.findUnique({ where: { id } });
};

export const getNurseByRegistration = async (registrationNo: string) => {
  return prisma.nurse.findUnique({ where: { registrationNo } });
};

export const updateNurse = async (id: number, data: Partial<NurseInput>) => {
  return prisma.nurse.update({
    where: { id },
    data,
  });
};

export const deleteNurse = async (id: number) => {
  return prisma.nurse.delete({ where: { id } });
};

const commonSearchFields = ["fullName", "mobileNumber", "registrationNo"];

export const searchNurse = createSearchService(prisma, {
  tableName: "Nurse",
  cacheKeyPrefix: "nurse",
  ...applyCommonFields(commonSearchFields),
});
