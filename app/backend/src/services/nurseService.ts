import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";
import { filterPaginate } from "../utils/filterPaginate";
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
    "registrationNo"
  );

  return prisma.nurse.create({
    data: {
      ...data,
      registrationNo,
    },
  });
};

export const getNurseByEmail = async (email: string) => {
  return prisma.nurse.findUnique({ where: { email } });
};

export const getAllNurses = async (cursor?: string, limit?: number) => {
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
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Update Nurse
    const updatedNurse = await tx.nurse.update({
      where: { id },
      data,
    });

    // 2️⃣ Sync ONLY identity fields to User
    const userUpdateData: any = {};

    if (data.fullName) {
      userUpdateData.name = data.fullName;
    }

    if (data.email) {
      userUpdateData.email = data.email;
    }

    if (Object.keys(userUpdateData).length > 0) {
      await tx.user.update({
        where: { regId: updatedNurse.registrationNo },
        data: userUpdateData,
      });
    }

    return updatedNurse;
  });
};

export const deleteNurse = async (id: number) => {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Find nurse first to get registrationNo
    const nurse = await tx.nurse.findUnique({
      where: { id },
      select: { registrationNo: true },
    });

    if (!nurse) {
      return null;
    }

    // 2️⃣ Delete nurse
    const deletedNurse = await tx.nurse.delete({
      where: { id },
    });

    // 3️⃣ Delete linked user (mirror cleanup)
    await tx.user.delete({
      where: { regId: nurse.registrationNo },
    });

    return deletedNurse;
  });
};

const commonSearchFields = ["fullName", "mobileNumber", "registrationNo"];

export const searchNurse = createSearchService(prisma, {
  tableName: "Nurse",
  cacheKeyPrefix: "nurse",
  ...applyCommonFields(commonSearchFields),
});

export const filterNursesService = async (filters: {
  fromDate?: Date;
  toDate?: Date;
  shift?: string;
  status?: string;
  cursor?: string | number;
  limit?: number;
}) => {
  const { fromDate, toDate, shift, status, cursor, limit } = filters;

  const filterObj: Record<string, any> = {};

  if (shift) filterObj.shift = { equals: shift, mode: "insensitive" };

  if (status) filterObj.status = { equals: status, mode: "insensitive" };

  if (fromDate || toDate)
    filterObj.createdAt = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };

  return filterPaginate(
    prisma,
    {
      model: "nurse",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};
