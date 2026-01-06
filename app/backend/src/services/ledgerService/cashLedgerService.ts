import { prisma } from "../../lib/prisma";
import { applyCommonFields } from "../../utils/applyCommonFields";
import { filterPaginate } from "../../utils/filterPaginate";
import { cursorPaginate } from "../../utils/pagination";
import { createSearchService } from "../../utils/searchCache";

type CashAmountType = "INCOME" | "EXPENSE";

type CashLedgerCreateInput = {
  transactionDate: Date;
  purpose: string;
  amountType: CashAmountType;
  amount: number;
  remarks?: string;
};

type CashLedgerUpdateInput = Partial<CashLedgerCreateInput>;

export const createCashLedgerEntry = async (
  data: CashLedgerCreateInput
) => {
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
    const amount = entry.amount.toNumber();
    return entry.amountType === "INCOME"
      ? balance + amount
      : balance - amount;
  }, 0);
};

export const updateCashLedgerEntry = async (
  id: number,
  data: CashLedgerUpdateInput
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
  amountType?: CashAmountType;
  fromDate?: Date;
  toDate?: Date;
  cursor?: string | number;
  limit?: number;
}) => {
  const { amountType, fromDate, toDate, cursor, limit } = filters;

  const filterObj: Record<string, any> = {};

  if (amountType) filterObj.amountType = amountType;

  if (fromDate || toDate) {
    filterObj.transactionDate = {
      gte: fromDate,
      lte: toDate,
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
