import { prisma } from "../../lib/prisma";
import { applyCommonFields } from "../../utils/applyCommonFields";
import { filterPaginate } from "../../utils/filterPaginate";
import { cursorPaginate } from "../../utils/pagination";
import { createSearchService } from "../../utils/searchCache";

export const createCashLedgerEntry = async (data: {
  date: Date;
  purpose: string;
  amountType: string;
  amount: number;
  remarks?: string;
}) => {
  return prisma.cashLedger.create({ data });
};

export const getAllCashLedgerService = async (
  cursor?: string,
  limit?: number
) => {
  return cursorPaginate(
    prisma,
    {
      model: "cashLedger",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
};

export const getCashLedgerEntryById = async (id: number) => {
  return prisma.cashLedger.findUnique({ where: { id } });
};

export const getCashBalance = async () => {
  const entries = await prisma.cashLedger.findMany({
    select: { amountType: true, amount: true },
  });

  return entries.reduce((balance, entry) => {
    const amount = entry.amount.toNumber(); // convert Decimal to number
    return entry.amountType === "Credit" ? balance + amount : balance - amount;
  }, 0);
};

export const updateCashLedgerEntry = async (
  id: number,
  data: {
    date?: Date;
    purpose?: string;
    amountType?: string;
    amount?: number;
    remarks?: string;
  }
) => {
  return prisma.cashLedger.update({
    where: { id },
    data,
  });
};

export const deleteCashLedgerEntry = async (id: number) => {
  return prisma.cashLedger.delete({ where: { id } });
};

const commonSearchFields = ["purpose"];

export const searchCashLedger = createSearchService(prisma, {
  tableName: "CashLedger",
  cacheKeyPrefix: "cash-ledger",
  ...applyCommonFields(commonSearchFields),
});

export const filterCashLedgerService = async (filters: {
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
      model: "cashLedger",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};
