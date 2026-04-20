import { prisma } from "../lib/prisma";
import { cursorPaginate } from "../utils/pagination";
import { filterPaginate } from "../utils/filterPaginate";
import { createSearchService } from "../utils/searchCache";
import { bumpCacheVersion } from "../utils/cacheVersion";

export type CashInput = {
  cashName: string;
  isActive?: boolean;
};

export const generateCashCode = async (): Promise<string> => {
  const lastCash = await prisma.cashAccount.findFirst({
    orderBy: { id: "desc" },
  });

  const nextNumber = lastCash ? lastCash.id + 1 : 1;
  return `CASH-${nextNumber}`;
};

export const createCashAccount = async (data: CashInput) => {
  const code = await generateCashCode();

  const result = await prisma.cashAccount.create({
    data: {
      ...data,
      code,
    },
  });

  await bumpCacheVersion("cashaccount");

  return result;
};

export const getCashAccountByName = async (cashName: string) => {
  return prisma.cashAccount.findFirst({
    where: { 
      cashName: {
        equals: cashName,
        mode: "insensitive"
      }
    },
  });
};

export const getCashAccountByCode = async (code: string) => {
  return prisma.cashAccount.findUnique({ where: { code } });
};

export const getAllCashAccounts = async (cursor?: string) => {
  return cursorPaginate(prisma, { model: "cashAccount" }, cursor);
};

export const getCashAccountById = async (id: number) => {
  return prisma.cashAccount.findUnique({ where: { id } });
};

export const updateCashAccount = async (id: number, data: Partial<CashInput>) => {
  const result = await prisma.cashAccount.update({
    where: { id },
    data,
  });

  await bumpCacheVersion("cashaccount");

  return result;
};

export const deleteCashAccount = async (id: number) => {
  const result = await prisma.cashAccount.delete({
    where: { id },
  });

  await bumpCacheVersion("cashaccount");

  return result;
};

export const searchCashAccount = createSearchService(prisma, {
  tableName: "CashAccount",
  exactFields: ["cashName", "code"],
  prefixFields: ["cashName", "code"],
  similarFields: ["cashName"],
  selectFields: [
    "id",
    "code",
    "cashName",
    "isActive",
    "createdAt",
    "updatedAt",
  ],
});

type FilterCashAccountParams = {
  fromDate?: Date;
  toDate?: Date;
  isActive?: boolean;
  cursor?: string;
  limit?: number;
};

export const filterCashAccountsService = async (
  params: FilterCashAccountParams
) => {
  const { fromDate, toDate, isActive, cursor, limit } = params;

  const where: Record<string, any> = {};

  // Active status filter
  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  // Date range filter
  if (fromDate || toDate) {
    where.createdAt = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "cashAccount",
      limit,
    },
    cursor,
    where
  );
};