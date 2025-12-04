import { prisma } from "../../lib/prisma";
import { applyCommonFields } from "../../utils/applyCommonFields";
import { filterPaginate } from "../../utils/filterPaginate";
import { cursorPaginate } from "../../utils/pagination";
import { createSearchService } from "../../utils/searchCache";

export const createBankLedgerEntry = async (data: {
  bankName: string;
  date: Date;
  description: string;
  amountType: string;
  amount: number;
  transactionId?: string;
  remarks?: string;
}) => {
  return prisma.bankLedger.create({ data });
};

export const getAllBankLedgerService = async (
  cursor?: string,
  limit?: number
) => {
  return cursorPaginate(
    prisma,
    {
      model: "bankLedger",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
};

export const getBankLedgerEntryById = async (id: number) => {
  return prisma.bankLedger.findUnique({ where: { id } });
};

export const getBankBalance = async (bankName: string) => {
  const entries = await prisma.bankLedger.findMany({
    where: { bankName },
    select: { amountType: true, amount: true },
  });

  return entries.reduce((balance, entry) => {
    const amount = entry.amount.toNumber();
    return entry.amountType === "Credit" ? balance + amount : balance - amount;
  }, 0);
};

export const updateBankLedgerEntry = async (
  id: number,
  data: {
    bankName?: string;
    date?: Date;
    description?: string;
    amountType?: string;
    amount?: number;
    transactionId?: string;
    remarks?: string;
  }
) => {
  return prisma.bankLedger.update({
    where: { id },
    data,
  });
};

export const deleteBankLedgerEntry = async (id: number) => {
  return prisma.bankLedger.delete({ where: { id } });
};

const commonSearchFields = ["bankName"];

export const searchBankLedger = createSearchService(prisma, {
  tableName: "BankLedger",
  cacheKeyPrefix: "bank-ledger",
  ...applyCommonFields(commonSearchFields),
});

export const filterBankLedgerService = async (filters: {
  amountType?: string;
  fromDate?: Date;
  toDate?: Date;
  cursor?: string | number;
  limit?: number;
}) => {
  const { amountType, fromDate, toDate, cursor, limit } = filters;

  const filterObj: any = {};

  if (amountType)
    filterObj.amountType = { equals: amountType, mode: "insensitive" };

  if (fromDate || toDate) {
    filterObj.date = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "bankLedger",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};
