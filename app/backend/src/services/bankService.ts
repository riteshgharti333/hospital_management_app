import { prisma } from "../lib/prisma";
import { cursorPaginate } from "../utils/pagination";
import { filterPaginate } from "../utils/filterPaginate";
import { createSearchService } from "../utils/searchCache";
import { bumpCacheVersion } from "../utils/cacheVersion";

export type BankInput = {
  bankName: string;
  accountNo: string;
  ifscCode?: string;
  isActive?: boolean;
};

export const generateBankCode = async (): Promise<string> => {
  const lastBank = await prisma.bankAccount.findFirst({
    orderBy: { id: "desc" },
  });

  const nextNumber = lastBank ? lastBank.id + 1 : 1;
  return `BANK-${nextNumber}`;
};

export const createBankAccount = async (data: BankInput) => {
  const code = await generateBankCode();

  const result = await prisma.bankAccount.create({
    data: {
      ...data,
      code,
    },
  });

  await bumpCacheVersion("bankaccount");

  return result;
};

export const getBankAccountByAccountNo = async (accountNo: string) => {
  return prisma.bankAccount.findFirst({
    where: { accountNo },
  });
};

export const getBankAccountByCode = async (code: string) => {
  return prisma.bankAccount.findUnique({ where: { code } });
};

export const getAllBankAccounts = async (cursor?: string) => {
  return cursorPaginate(prisma, { model: "bankAccount" }, cursor);
};

export const getBankAccountById = async (id: number) => {
  return prisma.bankAccount.findUnique({ where: { id } });
};

export const updateBankAccount = async (id: number, data: Partial<BankInput>) => {
  const result = await prisma.bankAccount.update({
    where: { id },
    data,
  });

  await bumpCacheVersion("bankaccount");

  return result;
};

export const deleteBankAccount = async (id: number) => {
  const result = await prisma.bankAccount.delete({
    where: { id },
  });

  await bumpCacheVersion("bankaccount");

  return result;
};

export const searchBankAccount = createSearchService(prisma, {
  tableName: "BankAccount",
  exactFields: ["bankName", "accountNo", "code"],
  prefixFields: ["bankName", "accountNo"],
  similarFields: ["bankName"],
  selectFields: [
    "id",
    "code",
    "bankName",
    "accountNo",
    "ifscCode",
    "isActive",
    "createdAt",
    "updatedAt",
  ],
});

type FilterBankAccountParams = {
  fromDate?: Date;
  toDate?: Date;
  isActive?: boolean;
  cursor?: string;
  limit?: number;
};

export const filterBankAccountsService = async (
  params: FilterBankAccountParams
) => {
  const { fromDate, toDate, isActive, cursor, limit } = params;

  const where: Record<string, any> = {};

  // ✅ Active status filter
  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  // ✅ Date range filter
  if (fromDate || toDate) {
    where.createdAt = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "bankAccount",
      limit,
      select: {
        id: true,
        code: true,
        bankName: true,
        accountNo: true,
        ifscCode: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    cursor,
    where
  );
};