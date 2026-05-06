import { prisma } from "../lib/prisma";
import { bumpCacheVersion } from "../utils/cacheVersion";
import { filterPaginate } from "../utils/filterPaginate";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";
import { generateRegistrationNumber } from "../utils/registrationGenerator";

export type NurseInput = {
  fullName: string;
  mobileNumber: string;
  department: string;
  address: string;
  shift: string;
  email: string;
  status?: string;
};

export const createNurse = async (data: NurseInput) => {
  const registrationNo = await generateRegistrationNumber(
    prisma.nurse,
    "NUR",
    "registrationNo",
  );

  const nurse = await prisma.nurse.create({
    data: {
      ...data,
      registrationNo,
    },
  });

  await bumpCacheVersion("nurse");
  return nurse;
};

export const getNurseByEmail = async (email: string) => {
  return prisma.nurse.findUnique({ where: { email } });
};

export const getAllNursesService = async (cursor?: string) => {
  return cursorPaginate(prisma, { model: "nurse" }, cursor);
};

export const getNurseById = async (id: number) => {
  return prisma.nurse.findUnique({ where: { id } });
};

export const updateNurse = async (id: number, data: Partial<NurseInput>) => {
  const nurse = await prisma.$transaction(async (tx) => {
    const updatedNurse = await tx.nurse.update({
      where: { id },
      data,
    });

    const userUpdateData: any = {};
    if (data.fullName) userUpdateData.name = data.fullName;
    if (data.email) userUpdateData.email = data.email;

    if (Object.keys(userUpdateData).length > 0) {
      await tx.user.update({
        where: { regId: updatedNurse.registrationNo },
        data: userUpdateData,
      });
    }

    return updatedNurse;
  });

  await bumpCacheVersion("nurse");
  return nurse;
};

export const deleteNurse = async (id: number) => {
  const nurse = await prisma.$transaction(async (tx) => {
    const nurseData = await tx.nurse.findUnique({
      where: { id },
      select: { registrationNo: true },
    });

    if (!nurseData) return null;

    const deletedNurse = await tx.nurse.delete({ where: { id } });
    await tx.user.deleteMany({ where: { regId: nurseData.registrationNo } });

    return deletedNurse;
  });

  await bumpCacheVersion("nurse");
  return nurse;
};

export const searchNurse = createSearchService(prisma, {
  tableName: "Nurse",
  exactFields: ["fullName", "mobileNumber", "registrationNo"],
  prefixFields: ["fullName"],
  similarFields: ["fullName"],
  selectFields: [
    "id",
    "registrationNo",
    "fullName",
    "mobileNumber",
    "department",
    "address",
    "shift",
    "email",
    "status",
    "createdAt",
  ],
});

type FilterNurseParams = {
  fromDate?: Date;
  toDate?: Date;
  shift?: string;
  status?: string;
  cursor?: string;
  limit?: number;
};

export const filterNursesService = async (params: FilterNurseParams) => {
  const { fromDate, toDate, shift, status, cursor } = params;

  const where: Record<string, any> = {};

  if (shift) {
    where.shift = {
      equals: shift,
      mode: "insensitive",
    };
  }

  if (status) {
    where.status = {
      equals: status,
      mode: "insensitive",
    };
  }

  if (fromDate || toDate) {
    where.createdAt = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "nurse",
    },
    cursor,
    where,
  );
};
